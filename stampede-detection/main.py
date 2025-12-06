# main.py
import cv2
import argparse
from predictor import Predictor
from helpers import resize_frame, send_alert
from dashboard import Dashboard
from whatsapp_alerts import send_whatsapp_alert  # Using PyWhatKit version
import time


def main(video_source=0, model_path="yolov5s.pt", threshold=25):
    """Run the stampede detection loop.

    Args:
        video_source: integer camera index or path to video file
        model_path: path to the YOLO model file
        threshold: people count threshold for alerts
    """
    cap = cv2.VideoCapture(video_source, cv2.CAP_DSHOW)  # DirectShow backend for Windows

    if not cap.isOpened():
        print("❌ Error: Could not open video source")
        return

    predictor = Predictor(model_path=model_path)  # Load YOLOv5
    dashboard = Dashboard()

    # Cooldown setup to avoid spamming WhatsApp
    last_alert_time = 0
    COOLDOWN_SECONDS = 10

    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Failed to read frame from camera or end of video")
            break

        # Resize for efficiency
        frame = resize_frame(frame)

        # YOLOv5 prediction
        frame, people_count = predictor.predict(frame)

        # Show info on frame
        cv2.putText(frame, f"People: {people_count}", (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Console alert
        send_alert(people_count, threshold)

        # WhatsApp alert with cooldown
        now = time.time()
        if people_count > threshold and (now - last_alert_time) > COOLDOWN_SECONDS:
            send_whatsapp_alert(people_count)  # modified for PyWhatKit version
            last_alert_time = now

        # Update dashboard
        dashboard.update(people_count)

        # Show video feed
        cv2.imshow("Stampede Detection", frame)

        # Exit on 'q'
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Stampede Detection System")
    parser.add_argument("--video", "-v", default=None,
                        help="Video source: camera index (0) or path to video file")
    parser.add_argument("--model", "-m", default="yolov5s.pt",
                        help="Path to YOLO model file (default: yolov5s.pt)")
    parser.add_argument("--threshold", "-t", type=int, default=25,
                        help="People count threshold for alerts")
    args = parser.parse_args()

    # Determine video source type (int for camera index)
    video_src = 0 if args.video is None else args.video
    try:
        # convert numeric strings to int for camera indices
        video_src = int(video_src)
    except Exception:
        pass

    print("Starting Stampede Detection System...")
    main(video_source=video_src, model_path=args.model, threshold=args.threshold)
