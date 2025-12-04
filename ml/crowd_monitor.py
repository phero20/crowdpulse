import cv2
import os
from ultralytics import YOLO
import supervision as sv
import numpy as np

# 1. Load Model
model = YOLO('yolov8n.pt')  # 'n' is nano (fastest)

# 2. Box annotator (reusable)
box_annotator = sv.BoxAnnotator()

def process_video(video_path="crowd.mp4", loop=True):
    # Check if file exists, otherwise use webcam
    if not os.path.exists(video_path) and video_path != 0:
        print(f"Warning: {video_path} not found. Using webcam (0) instead.")
        video_path = 0

    while True:
        # Initialize tracker for each video loop
        tracker = sv.ByteTrack()
        # Store previous positions to calculate speed (reset for each loop)
        previous_positions = {}
        
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print(f"Error: Could not open video {video_path}")
            break
        
        frame_count = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                # Video ended, check if we should loop
                if loop and video_path != 0:  # Don't loop webcam
                    print(f"Video ended. Replaying from start... (Frame {frame_count})")
                    cap.release()
                    break  # Break inner loop to restart video
                else:
                    cap.release()
                    return  # End completely if not looping or webcam

            # 3. Detect
            results = model(frame)[0]
            detections = sv.Detections.from_ultralytics(results)
            # Filter only 'person' class (ID 0)
            detections = detections[detections.class_id == 0]

            # 4. Track (Assign IDs)
            detections = tracker.update_with_detections(detections)

            # 5. Calculate Chaos (Speed & Direction)
            speeds = []
            for tracker_id, box in zip(detections.tracker_id, detections.xyxy):
                center_x = (box[0] + box[2]) / 2
                center_y = (box[1] + box[3]) / 2
                current_pos = np.array([center_x, center_y])

                if tracker_id in previous_positions:
                    # Calculate distance moved since last frame
                    prev_pos = previous_positions[tracker_id]
                    distance = np.linalg.norm(current_pos - prev_pos)
                    speed = distance * 30 # (Pixels per second assuming 30fps)
                    speeds.append(speed)
                
                previous_positions[tracker_id] = current_pos

            # 6. Panic Logic
            avg_speed = np.mean(speeds) if speeds else 0.0
            num_people = len(detections)
            
            # ALERT CONDITION - More realistic thresholds
            status = "NORMAL"
            if num_people > 10 and avg_speed > 50: # Tune these numbers!
                status = "STAMPEDE RISK!"
            elif num_people == 0:
                status = "IDLE"
            
            # Calculate stress level based on speed and density
            # Higher speed and more people = higher stress
            speed_factor = min(avg_speed / 100.0, 1.0)  # Normalize speed (0-1)
            density_factor = min(num_people / 50.0, 1.0)  # Normalize density (0-1)
            stress_level = int((speed_factor * 0.6 + density_factor * 0.4) * 100)

            # Draw on frame with accurate information
            frame = box_annotator.annotate(scene=frame, detections=detections)
            
            # Status text color
            status_color = (0, 255, 0) if status == "NORMAL" else (0, 0, 255) if status == "STAMPEDE RISK!" else (128, 128, 128)
            
            # Draw status and stats on frame
            cv2.putText(frame, f"Status: {status}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, status_color, 2)
            cv2.putText(frame, f"People: {num_people}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(frame, f"Avg Speed: {avg_speed:.1f} px/s", (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(frame, f"Stress: {stress_level}%", (10, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            stats = {
                "people_count": int(num_people),
                "avg_speed": float(avg_speed),
                "status": status,
                "stress_level": stress_level
            }
            yield frame, stats
            frame_count += 1
        
        # If we broke from inner loop and not looping, exit outer loop
        if not loop or video_path == 0:
            break
    
    # Final cleanup
    if 'cap' in locals():
        cap.release()

if __name__ == "__main__":
    for frame, stats in process_video():
        print(f"Stats: {stats}")
        cv2.imshow("Crowd Monitor", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'): break
    cv2.destroyAllWindows()