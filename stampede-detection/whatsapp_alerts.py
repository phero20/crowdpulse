import cv2
import pygame
import time
import os
import pywhatkit as kit
import numpy as np

# =============================
# Initialize Pygame for alarm sound
# =============================
pygame.mixer.init()

# =============================
# File paths & folders
# =============================
ALARM_SOUND = "alarm1.wav"  # Make sure this file exists
VIDEO_FOLDER = "stampede_videos"
os.makedirs(VIDEO_FOLDER, exist_ok=True)

# =============================
# WhatsApp Configuration
# =============================
RECIPIENTS = ["+919676330328"]
ALERT_MESSAGE = "⚠️ ALERT! Crowd movement detected. Possible stampede!"

# =============================
# Alarm functions
# =============================
def play_alarm():
    try:
        pygame.mixer.music.load(ALARM_SOUND)
        pygame.mixer.music.play(-1)  # Loop indefinitely
    except Exception as e:
        print(f"Error playing alarm: {e}")

def stop_alarm():
    pygame.mixer.music.stop()

# =============================
# WhatsApp alert function
# =============================
def send_whatsapp_alert(count_or_video_path, frame=None):
    """
    Send WhatsApp alert with optional snapshot.
    - If frame is provided, sends image + message.
    - If only count_or_video_path, sends text message with path.
    """
    for recipient in RECIPIENTS:
        try:
            print(f"Sending WhatsApp alert to {recipient}...")
            if frame is not None:
                # Save snapshot
                snapshot_path = f"{VIDEO_FOLDER}/snapshot_{int(time.time())}.png"
                cv2.imwrite(snapshot_path, frame)
                kit.sendwhats_image(
                    recipient,
                    snapshot_path,
                    f"{ALERT_MESSAGE}\nCrowd count: {count_or_video_path}"
                )
            else:
                # Wait a few seconds to let WhatsApp Web load
                time.sleep(5)
                kit.sendwhatmsg_instantly(
                    recipient,
                    f"{ALERT_MESSAGE}\nCrowd count / Video: {count_or_video_path}",
                    wait_time=10
                )
            print(f"Alert sent to {recipient}.")
        except Exception as e:
            print(f"Failed to send alert: {e}")

# =============================
# Stampede detection logic
# =============================
def detect_stampede(frame, prev_gray):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    if prev_gray is None:
        return False, gray

    # Dense optical flow
    flow = cv2.calcOpticalFlowFarneback(prev_gray, gray, None,
                                        0.5, 3, 15, 3, 5, 1.2, 0)
    mag, ang = cv2.cartToPolar(flow[..., 0], flow[..., 1])
    mean_mag = np.mean(mag)
    motion_ratio = np.sum(mag > 2) / mag.size

    # Debug info
    cv2.putText(frame, f"Motion: {mean_mag:.2f}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
    cv2.putText(frame, f"Activity: {motion_ratio*100:.2f}%", (10, 60),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2)

    # Stampede threshold
    if mean_mag > 4.0 and motion_ratio > 0.25:
        return True, gray
    return False, gray

# =============================
# Optional: standalone surveillance for testing
# =============================
def start_surveillance(camera_index=0):
    cap = cv2.VideoCapture(camera_index, cv2.CAP_DSHOW)
    if not cap.isOpened():
        print("❌ Error: Could not open camera.")
        return

    prev_gray = None
    recording = False
    video_writer = None
    start_time = None
    alert_triggered = False

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        stampede_detected, prev_gray = detect_stampede(frame, prev_gray)

        if stampede_detected and not alert_triggered:
            if not recording:
                print("🚨 Stampede-like motion detected! Starting recording...")
                play_alarm()
                video_path = f"{VIDEO_FOLDER}/stampede_{int(time.time())}.mp4"
                fourcc = cv2.VideoWriter_fourcc(*"mp4v")
                video_writer = cv2.VideoWriter(video_path, fourcc, 20.0,
                                               (frame.shape[1], frame.shape[0]))
                start_time = time.time()
                recording = True

        if recording:
            video_writer.write(frame)
            if time.time() - start_time >= 10:
                print("Recording completed. Sending alert...")
                video_writer.release()
                send_whatsapp_alert(video_path, frame)  # snapshot + path
                alert_triggered = True
                recording = False
                stop_alarm()

        # Reset cooldown
        if alert_triggered and time.time() - start_time >= 30:
            print("System reset ready for new detection.")
            alert_triggered = False

        cv2.imshow("Stampede Detection System", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

# =============================
# Main entry point
# =============================
if __name__ == "__main__":
    print("Starting Stampede Detection System...")
    start_surveillance()
