from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import cv2
import threading
import time
import queue
import numpy as np
from predictor import Predictor
from heatmap import HeatmapGenerator
from helpers import resize_frame

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Global variable to store latest stats (thread-safe updates)
latest_stats = {
    "people_count": 0,
    "avg_speed": 0.0,
    "status": "IDLE",
    "stress_level": 0
}

# Global variable to store latest heatmap frame
latest_heatmap_img = None

# Lock for thread-safe stats updates
stats_lock = threading.Lock()

# Initialize Predictor (Global)
# Reverted to YOLOv8 Large (High Accuracy) to fix box-lag/mismatch issue
MODEL_PATH = "yolov8l.pt"
ALERT_THRESHOLD = 1

predictor = None

def get_predictor():
    global predictor
    if predictor is None:
        try:
            predictor = Predictor(model_path=MODEL_PATH)
        except Exception as e:
            print(f"Error loading predictor: {e}")
    return predictor

@app.on_event("startup")
async def startup_event():
    get_predictor()

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "message": "File uploaded successfully"}

@app.post("/settings/model")
async def set_model(model_name: str):
    """
    Switch the YOLO model at runtime.
    Options: yolov8n.pt, yolov8s.pt, yolov8m.pt, yolov8l.pt, yolov8x.pt
    """
    global MODEL_PATH, predictor
    
    valid_models = ["yolov8n.pt", "yolov8s.pt", "yolov8m.pt", "yolov8l.pt", "yolov8x.pt"]
    if model_name not in valid_models:
         return JSONResponse(status_code=400, content={"error": "Invalid model name"})
    
    # Update Global Config
    MODEL_PATH = model_name
    
    # Force Reload
    predictor = None
    
    print(f"SWITCHING MODEL TO: {model_name}")
    return {"message": f"Model switched to {model_name}"}

@app.get("/settings/model")
async def get_model():
    """Return the current active model."""
    return {"model": MODEL_PATH}

class AsyncVideoProcessor:
    def __init__(self, source):
        self.source = source
        self.cap = cv2.VideoCapture(source)
        self.running = True
        
        # Shared State
        self.last_boxes = []
        self.last_count = 0
        self.last_zone_counts = [0, 0, 0, 0]
        self.status = "NORMAL"
        self.lock = threading.Lock()
        
        # Inference Queue
        self.inference_queue = queue.Queue(maxsize=1)
        
        # Start Inference Thread
        self.thread = threading.Thread(target=self._inference_loop, daemon=True)
        self.thread.start()

        # Lazy Init Heatmap
        self.heatmap_gen = None

    def _inference_loop(self):
        """Worker thread that runs heavy YOLO inference on RAW frames"""
        global latest_stats, latest_heatmap_img
        
        while self.running:
            # Dynamic Reload: Fetch predictor every loop in case it changed
            pred = get_predictor()
            if not pred:
                time.sleep(1) # Wait for it to initialize
                continue

            try:
                # Get the raw original frame
                original_frame = self.inference_queue.get(timeout=1)
            except queue.Empty:
                continue
            
            # 1. DETECT on Original High-Res Frame (Best Accuracy)
            # This sees small faces that disappear in 720p
            raw_boxes = pred.detect_only(original_frame)
            
            # 2. Map coordinates to Standard Resolution (720p)
            # We must normalize everything to 1280x720 (or whatever resize_frame produces)
            # to keep heatmap density and grid logic consistent.
            
            orig_h, orig_w = original_frame.shape[:2]
            
            # Create a dummy resized frame just to get dimensions consistent with display logic
            # This is fast/cheap
            standard_frame = resize_frame(original_frame)
            std_h, std_w = standard_frame.shape[:2]
            
            scale_x = std_w / orig_w
            scale_y = std_h / orig_h
            
            scaled_boxes = []
            for (rx1, ry1, rx2, ry2) in raw_boxes:
                sx1 = int(rx1 * scale_x)
                sy1 = int(ry1 * scale_y)
                sx2 = int(rx2 * scale_x)
                sy2 = int(ry2 * scale_y)
                scaled_boxes.append((sx1, sy1, sx2, sy2))
                
            count = len(scaled_boxes)
            
            # 3. Use Scaled Boxes for Logic
            mid_x, mid_y = std_w // 2, std_h // 2
            
            zone_counts = [0, 0, 0, 0]
            centroids = []
            
            for (x1, y1, x2, y2) in scaled_boxes:
                cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
                centroids.append((cx, cy))
                if cx < mid_x and cy < mid_y:
                    zone_counts[0] += 1
                elif cx >= mid_x and cy < mid_y:
                    zone_counts[1] += 1
                elif cx < mid_x and cy >= mid_y:
                    zone_counts[2] += 1
                else:
                    zone_counts[3] += 1
            
            # Heatmap Processing
            max_density = 0.0
            
            if self.heatmap_gen is None:
                 self.heatmap_gen = HeatmapGenerator((std_h, std_w, 3))
                 
            if self.heatmap_gen:
                hm_img, max_val = self.heatmap_gen.generate(centroids)
                max_density = max_val
                ret_hm, buffer_hm = cv2.imencode('.jpg', hm_img)
                if ret_hm:
                     with stats_lock:
                         latest_heatmap_img = buffer_hm.tobytes()

            # Alert Logic & Status Colors
            DENSITY_THRESHOLD_RISK = 0.2
            print("Density Threshold Risk: ", DENSITY_THRESHOLD_RISK,max_density)
            DENSITY_THRESHOLD_WARN = 0.015
            GLOBAL_COUNT_THRESHOLD = 20 
            
            status = "NORMAL"
            if max_density > DENSITY_THRESHOLD_RISK:
                status = "STAMPEDE RISK!"
            elif max_density > DENSITY_THRESHOLD_WARN:
                status = "WARNING"
            elif count > GLOBAL_COUNT_THRESHOLD:
                status = "WARNING"
            
            density_stress = min(100, int((max_density / 0.04) * 100))
            volume_stress = min(100, int((count / GLOBAL_COUNT_THRESHOLD) * 100))
            stress_level = max(density_stress, volume_stress)

            # Update Shared State (Used by Display Thread)
            with self.lock:
                self.last_boxes = scaled_boxes 
                self.last_count = count
                self.last_zone_counts = zone_counts
                self.status = status
            
            with stats_lock:
                latest_stats = {
                    "people_count": count,
                    "avg_speed": 0.0,
                    "status": status,
                    "stress_level": stress_level
                }

    def generate_frames(self):
        """Generator that yields frames at video speed"""
        
        if not self.cap.isOpened():
            return

        try:
            while True:
                ret, original_frame = self.cap.read()
                if not ret:
                    if isinstance(self.source, str):
                        self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                        continue
                    else:
                        break
                
                # Push original for inference
                if not self.inference_queue.full():
                    try:
                        self.inference_queue.put_nowait(original_frame.copy())
                    except queue.Full:
                        pass
                
                # Resize for display
                display_frame = resize_frame(original_frame)
                h, w, _ = display_frame.shape
                mid_x, mid_y = w // 2, h // 2
                
                # --- DRAWING ---
                with self.lock:
                    boxes = self.last_boxes
                    count = self.last_count
                    z_counts = self.last_zone_counts
                    curr_status = self.status

                # Determine Colors based on Status
                # BGR Format: Blue, Green, Red
                if curr_status == "STAMPEDE RISK!":
                    status_color = (0, 0, 255) # Red
                elif curr_status == "WARNING":
                    status_color = (0, 215, 255) # Gold/Yellowish
                else:
                    status_color = (0, 255, 0) # Green

                # Draw Grid & Boxes
                cv2.line(display_frame, (mid_x, 0), (mid_x, h), status_color, 1)
                cv2.line(display_frame, (0, mid_y), (w, mid_y), status_color, 1)
                
                font = cv2.FONT_HERSHEY_SIMPLEX
                
                # Header Status Bar
                cv2.rectangle(display_frame, (0, 0), (w, 40), (0,0,0), -1)
                cv2.putText(display_frame, f"STATUS: {curr_status} | CNT: {count}", (10, 28), font, 0.8, status_color, 2)
                
                for (x1, y1, x2, y2) in boxes:
                    cv2.rectangle(display_frame, (x1, y1), (x2, y2), status_color, 2)
                
                # Zone Counts
                cv2.putText(display_frame, str(z_counts[0]), (20, 70), font, 1, status_color, 2)
                cv2.putText(display_frame, str(z_counts[1]), (mid_x + 20, 70), font, 1, status_color, 2)
                cv2.putText(display_frame, str(z_counts[2]), (20, mid_y + 40), font, 1, status_color, 2)
                cv2.putText(display_frame, str(z_counts[3]), (mid_x + 20, mid_y + 40), font, 1, status_color, 2)
                
                # Encode 
                ret, buffer = cv2.imencode('.jpg', display_frame)
                if ret:
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
                
                time.sleep(0.02)
                
        except GeneratorExit:
            self.running = False
        finally:
            self.running = False
            self.cap.release()

def process_video_gen(source):
    # Wrapper to maintain existing route signature
    processor = AsyncVideoProcessor(source)
    return processor.generate_frames()

def heatmap_stream_gen():
    """Generator that yields the latest heatmap frame repeatedly"""
    while True:
        frame_bytes = None
        with stats_lock:
            if latest_heatmap_img is not None:
                frame_bytes = latest_heatmap_img
        
        if frame_bytes:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        
        # Lower frame rate for heatmap is fine (10fps)
        time.sleep(0.1)

@app.get("/stream/{filename}")
async def stream_video(filename: str):
    video_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(video_path):
        return {"error": "File not found"}
    
    return StreamingResponse(process_video_gen(video_path), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/live")
async def stream_live():
    return StreamingResponse(process_video_gen(0), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/heatmap_feed")
async def get_heatmap_feed():
    return StreamingResponse(heatmap_stream_gen(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/stats")
async def get_stats():
    with stats_lock:
        return JSONResponse(content=latest_stats.copy())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
