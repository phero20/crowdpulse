from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import cv2
import threading
from crowd_monitor import process_video

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

# Lock for thread-safe stats updates
stats_lock = threading.Lock()

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "message": "File uploaded successfully"}

def generate_frames(video_path):
    global latest_stats
    try:
        # Process video with looping enabled (will replay automatically)
        for frame, stats in process_video(video_path, loop=True):
            # Update global stats thread-safely
            with stats_lock:
                latest_stats = {
                    "people_count": int(stats.get("people_count", 0)),
                    "avg_speed": float(stats.get("avg_speed", 0.0)),
                    "status": stats.get("status", "IDLE"),
                    "stress_level": int(stats.get("stress_level", 0))
                }
            
            ret, buffer = cv2.imencode('.jpg', frame)
            if ret:
                frame_bytes = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    except Exception as e:
        print(f"Error in video processing: {e}")
        import traceback
        traceback.print_exc()
        # Reset stats on error
        with stats_lock:
            latest_stats = {
                "people_count": 0,
                "avg_speed": 0.0,
                "status": "ERROR",
                "stress_level": 0
            }

@app.get("/stream/{filename}")
async def stream_video(filename: str):
    video_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(video_path):
        return {"error": "File not found"}
    
    return StreamingResponse(generate_frames(video_path), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/stats")
async def get_stats():
    """Returns the latest crowd monitoring statistics"""
    with stats_lock:
        return JSONResponse(content=latest_stats.copy())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
