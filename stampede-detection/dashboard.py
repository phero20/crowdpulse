# dashboard.py
import matplotlib.pyplot as plt

class Dashboard:
    def __init__(self):
        plt.ion()  # interactive mode
        self.fig, self.ax = plt.subplots()
        self.people_data = []
        self.line, = self.ax.plot([], [], label="People Count")
        self.ax.set_xlabel("Frames")
        self.ax.set_ylabel("Count")
        self.ax.set_title("Live People Count Dashboard")
        self.ax.legend()

    def update(self, people_count):
        self.people_data.append(people_count)

        # Update X (frames) and Y (people count)
        self.line.set_xdata(range(len(self.people_data)))
        self.line.set_ydata(self.people_data)

        # Adjust axis
        self.ax.relim()
        self.ax.autoscale_view()

        plt.draw()
        plt.pause(0.01)
