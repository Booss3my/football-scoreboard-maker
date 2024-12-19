export class Timer {
    constructor(timerElement, endTime = '45:00', callback) {
        this.timerElement = timerElement;
        this.endTime = this.convertTimeToSeconds(endTime); // End time in seconds
        this.initialTime = this.convertTimeToSeconds('00:00'); // Store the starting time
        this.elapsedTime = parseInt(localStorage.getItem('elapsedTime')) || this.initialTime; // Retrieve saved time or use initial time
        this.timerInterval = null;
        this.callback = callback; // Store the callback to be invoked

        // Ensure elapsed time doesn't exceed end time
        if (this.elapsedTime >= this.endTime) {
            this.elapsedTime = this.endTime;
        }

        this.updateDisplay(); // Initialize the display
    }

    // Convert time in MM:SS format to seconds
    convertTimeToSeconds(timeStr) {
        const [minutes, seconds] = timeStr.split(':').map(Number);
        return (minutes * 60) + seconds;
    }

    // Format seconds back to MM:SS
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    // Start the timer
    start() {
        if (this.timerInterval) clearInterval(this.timerInterval); // Clear previous intervals if any
        this.timerInterval = setInterval(() => this.update(), 1000);
    }

    // Pause the timer
    pause() {
        clearInterval(this.timerInterval);
    }

    // Set a custom starting point
    setStartTime(startTime) {
        const startInSeconds = this.convertTimeToSeconds(startTime);
        if (startInSeconds >= this.endTime) {
            console.warn("Start time exceeds or equals the end time. Adjusting to end time.");
            this.elapsedTime = this.endTime;
        } else {
            this.initialTime = startInSeconds;
            this.reset()
        }

        localStorage.setItem('elapsedTime', this.elapsedTime);
        this.updateDisplay();
    }

    // Reset the timer to the starting time
    reset() {
        this.elapsedTime = this.initialTime; // Reset to initial time
        localStorage.setItem('elapsedTime', this.elapsedTime);
        this.updateDisplay();
    }

    // Update the timer each second
    update() {
        if (this.elapsedTime < this.endTime) {
            this.elapsedTime++;
            localStorage.setItem('elapsedTime', this.elapsedTime);
            this.updateDisplay();

            // Call the callback to update display or perform other tasks
            if (this.callback) {
                const currentTime = this.formatTime(this.elapsedTime);
                this.callback(currentTime);
            }
        } else {
            this.pause(); // Stop the timer when the end time is reached
            console.log('Game Over'); // Optional debug log
        }
    }

    // Update the timer display
    updateDisplay() {
        this.timerElement.textContent = this.formatTime(this.elapsedTime);
    }
}
