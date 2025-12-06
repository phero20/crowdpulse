import cv2

def resize_frame(frame, width=1280, height=720):
    return cv2.resize(frame, (width, height))

def get_centroid(box):
    # YOLO gives (x1, y1, x2, y2)
    x1, y1, x2, y2 = box
    return (int((x1 + x2) / 2), int((y1 + y2) / 2))

def send_alert(count, threshold=20):
    if count > threshold:
        print(f"⚠ ALERT: High crowd density detected! ({count} people)")
