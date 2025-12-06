import numpy as np
import cv2

class HeatmapGenerator:
    def __init__(self, frame_shape, grid_size=50):
        self.h, self.w, _ = frame_shape
        self.grid_size = grid_size

    def generate(self, centroids):
        """
        Generate density map from centroids
        """
        heatmap = np.zeros((self.h, self.w), dtype=np.float32)

        for (x, y) in centroids:
            heatmap[y, x] += 1

        heatmap = cv2.GaussianBlur(heatmap, (0, 0), sigmaX=15, sigmaY=15)
        
        # Capture raw density peak for alert logic
        max_val = float(heatmap.max())
        
        heatmap_img = np.uint8(255 * heatmap / (max_val + 1e-6))
        heatmap_img = cv2.applyColorMap(heatmap_img, cv2.COLORMAP_JET)
        return heatmap_img, max_val
