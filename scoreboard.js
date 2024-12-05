import { Timer } from './timer.js'; // Import Timer class

window.addEventListener('load', function () {

    const URL = 'http://127.0.0.1:5000/api/scoreboard';
    const timerElement = document.getElementById('time');
    const timer = new Timer(timerElement, "45:00", (currentTime) => {
        timerElement.textContent = currentTime; // Update the display each second
    });
    timer.reset()
    timer.start();
    console.log(timer.elapsedTime)
    // Load state from the backend and apply to the scoreboard
    async function loadStateFromAPI() {
        try {
            const response = await fetch(URL);
            if (!response.ok) throw new Error(`Error fetching state: ${response.status}`);
            const state = await response.json();

            // Update scoreboard with values from the API
            document.getElementById('team-name-left').textContent = state.team1.name || 'Team 1';
            document.getElementById('team-name-right').textContent = state.team2.name || 'Team 2';
            document.getElementById('score-left').textContent = state.team1.score || '0';
            document.getElementById('score-right').textContent = state.team2.score || '0';
            // Initialize the timer with the game time from the state
            timer.initialTime = timer.elapsedTime || timer.convertTimeToSeconds(state.game_time); // Default to 45 minutes
            timer.reset()

            // Set team colors
            document.querySelector('.team-left').style.backgroundColor = state.team1.color || '#34003a';
            document.querySelector('.team-right').style.backgroundColor = state.team2.color || '#34003a';

            // Set team logos
            if (state.team1.logo) {
                document.querySelector('.team-left .logo img').src = `http://127.0.0.1:5000/uploads/${state.team1.logo}`;
            }
            if (state.team2.logo) {
                document.querySelector('.team-right .logo img').src = `http://127.0.0.1:5000/uploads/${state.team2.logo}`;
            }
        } catch (error) {
            console.error('Failed to load state:', error);
        }
    }

    loadStateFromAPI();
});
