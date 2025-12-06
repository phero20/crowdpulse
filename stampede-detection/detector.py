import cv2
import numpy as np
from ultralytics import YOLO

class YOLODetector:
    def __init__(self, model_path="yolov8n.pt"):
        self.model = YOLO(model_path)

    def detect(self, frame):
        """
        Detect people in the frame.
        Returns:
            frame (with bounding boxes if needed),
            people_count,
            centroids (list of (x, y) tuples),
            boxes (list of bounding boxes [x1, y1, x2, y2])
        """
        results = self.model(frame, verbose=False)[0]
        boxes = []
        centroids = []

        for r in results.boxes:
            if int(r.cls) == 0:  # class 0 = person
                x1, y1, x2, y2 = map(int, r.xyxy[0])
                boxes.append([x1, y1, x2, y2])
                cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
                centroids.append((cx, cy))

        return frame, len(boxes), centroids, boxes

    