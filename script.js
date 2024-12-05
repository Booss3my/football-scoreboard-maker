// Simple Timer Script
let time = 0; // Time in seconds
const timerElement = document.getElementById('time');

function updateTimer() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    time++;
}

setInterval(updateTimer, 1000); // Update every second
