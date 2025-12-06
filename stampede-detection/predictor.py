# predictor.py
import torch
import cv2

class Predictor:
    def __init__(self, model_path="yolov5s.pt"):
        """Initialize predictor.

        Tries to use the `ultralytics` package (YOLOv8 API) first, then falls back
        to `torch.hub.load('ultralytics/yolov5', ...)` if `ultralytics` isn't available.
        """
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.framework = None

        # Prefer ultralytics package (more reliable than torch.hub on some systems)
        try:
            from ultralytics import YOLO
            self.model = YOLO(model_path)
            self.framework = "ultralytics"
            return
        except Exception:
            # continue to torch.hub fallback
            pass

        try:
            # Load YOLOv5 via torch.hub (downloads ultralytics/yolov5 into torch cache)
            self.model = torch.hub.load("ultralytics/yolov5", "custom", path=model_path).to(self.device)
            self.framework = "yolov5_hub"
        except Exception as e:
            msg = (
                "Failed to load a YOLO model. Install the 'ultralytics' package or yolov5 repo.\n\n"
                "Fix options:\n"
                "1) Install ultralytics (recommended):\n"
                "   python -m pip install ultralytics\n\n"
                "2) Or install yolov5 from GitHub into your venv:\n"
                "   python -m pip install -U git+https://github.com/ultralytics/yolov5.git\n\n"
                "After installing, re-run your script. Original error: {}"
            ).format(e)
            raise RuntimeError(msg)

    def detect_only(self, frame):
        """Run prediction and return list of bounding boxes [(x1, y1, x2, y2), ...] for 'person' class."""
        boxes_list = []
        
        if self.framework == "ultralytics":
            # Optimization Tune:
            # imgsz=1024: (Balanced High-Res). 1920 was too slow (box lag). 
            # 1024 is 3.5x faster but still sharp.
            # iou=0.70: Keep crowd overlap logic.
            results = self.model(frame, verbose=False, conf=0.10, iou=0.70, imgsz=1024)  
            res = results[0]
            
            # Try efficient box extraction
            boxes = getattr(res, 'boxes', None)
            if boxes is not None:
                try:
                    xyxy = boxes.xyxy.cpu().numpy()
                    cls = boxes.cls.cpu().numpy()
                    
                    for i, b in enumerate(xyxy):
                        if len(b) >= 4:
                            x1, y1, x2, y2 = map(int, b[:4])
                            class_id = int(cls[i]) if (cls is not None and len(cls) > i) else -1
                            # 0 is person in COCO
                            if class_id == 0:
                                boxes_list.append((x1, y1, x2, y2))
                except Exception:
                    pass
            
            if not boxes_list:
                # Fallback to pandas
                try:
                    df = res.pandas().xyxy[0]
                    for _, row in df.iterrows():
                        if row.get('name', '') == 'person' or row.get('class', -1) == 0:
                            x1, y1, x2, y2 = map(int, [row['xmin'], row['ymin'], row['xmax'], row['ymax']])
                            boxes_list.append((x1, y1, x2, y2))
                except Exception:
                    pass

        else:
            # torch.hub yolov5 model
            results = self.model(frame)
            df = results.pandas().xyxy[0]
            for _, row in df.iterrows():
                if row['name'] == 'person':
                    x1, y1, x2, y2 = map(int, [row['xmin'], row['ymin'], row['xmax'], row['ymax']])
                    boxes_list.append((x1, y1, x2, y2))
        
        return boxes_list

    def predict(self, frame, alert=False):
        """Run prediction on a frame and return annotated frame + people count.
        
        Supports both `ultralytics.YOLO` and `torch.hub`-loaded yolov5 models.
        """
        boxes = self.detect_only(frame)
        people_count = len(boxes)
        
        for (x1, y1, x2, y2) in boxes:
            color = (0, 0, 255) if alert else (0, 255, 0)
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            
        return frame, people_count
