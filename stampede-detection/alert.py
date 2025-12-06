# alert.py
import cv2
from datetime import datetime

# ----------------------------
# Sound alert setup
# ----------------------------
USE_PYGAME = False
try:
    import pygame
    pygame.mixer.init()
    USE_PYGAME = True
except Exception:
    pass  # pygame not available, fallback to winsound

def _play_alert_sound():
    # 1️⃣ Try winsound (Windows built-in)
    try:
        import winsound
        winsound.Beep(1000, 400)  # 1000Hz, 0.4 sec
    except Exception:
        pass

    # 2️⃣ Try pygame if installed
    if USE_PYGAME:
        try:
            pygame.mixer.music.load("alert.mp3")  # put your alert sound file in project folder
            pygame.mixer.music.play()
        except Exception as e:
            print("Could not play pygame alert:", e)

# ----------------------------
# Alert System Class
# ----------------------------
class AlertSystem:
    def __init__(self, threshold=35, log_file="alerts.log", enable_iot=False):
        self.threshold = threshold
        self.log_file = log_file
        self.enable_iot = enable_iot

    def _log(self, tag, people_count):
        with open(self.log_file, "a") as f:
            f.write(f"[{datetime.now()}] {tag} Count={people_count}\n")

    def pre_alert(self, frame, people_count):
        # Orange overlay for warning
        overlay = frame.copy()
        cv2.rectangle(overlay, (0,0), (frame.shape[1], frame.shape[0]), (0,140,255), -1)
        cv2.addWeighted(overlay, 0.25, frame, 0.75, 0, frame)
        cv2.putText(frame, "PRE-ALERT: High Risk Soon", (30, 120),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.1, (255,255,255), 3)
        
        _play_alert_sound()  # <-- play beep or siren
        self._log("PRE-ALERT", people_count)
        return frame

    def check_and_alert(self, frame, people_count):
        if people_count > self.threshold:
            # Red blinking overlay
            overlay = frame.copy()
            cv2.rectangle(overlay, (0,0), (frame.shape[1], frame.shape[0]), (0,0,255), -1)
            alpha = 0.6 if (cv2.getTickCount() // 10) % 2 == 0 else 0.25
            cv2.addWeighted(overlay, alpha, frame, 1-alpha, 0, frame)
            cv2.putText(frame, "ALERT: Stampede Happening!", (30, 90),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255,255,255), 3)
            
            _play_alert_sound()  # <-- play beep or siren
            self._log("ALERT", people_count)
            
        return frame
