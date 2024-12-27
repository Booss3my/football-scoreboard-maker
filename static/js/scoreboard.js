import { Timer } from './timer.js'; // Import Timer class

window.addEventListener('load', function () {
    const RURL = window.instanceUrl;
    const URL = `${RURL}/api/scoreboard`; // API endpoint for scoreboard

    const timerElement = document.getElementById('time');
    const timer = new Timer(timerElement, "45:00", (currentTime) => {
        timerElement.textContent = currentTime; // Update the display each second
    });
    timer.reset();
    timer.start();

    // To track the current game time from the API
    let previousGameTime = null;

    // Load state from the backend and apply to the scoreboard
    async function loadStateFromAPI() {
        try {
            const response = await fetch(URL);
            if (!response.ok) throw new Error(`Error fetching state: ${response.status}`);
            const state = await response.json();
            console.log(state);

            // Update scoreboard with values from the API
            document.getElementById('team-name-left').textContent = state.team1.name || 'Team 1';
            document.getElementById('team-name-right').textContent = state.team2.name || 'Team 2';
            document.getElementById('score-left').textContent = state.team1.score || '0';
            document.getElementById('score-right').textContent = state.team2.score || '0';

            // Check if the game time has changed
            if (state.game_time && state.game_time !== previousGameTime) {
                previousGameTime = state.game_time; // Update the stored game time
                timer.initialTime = timer.convertTimeToSeconds(state.game_time); // Set the new timer value
                timer.reset();
            }

            // Set team colors
            document.querySelector('.team-left').style.backgroundColor = state.team1.color || '#34003a';
            document.querySelector('.team-right').style.backgroundColor = state.team2.color || '#34003a';

            // Set team logos
            if (state.team1.logo) {
                document.querySelector('.team-left .logo img').src = `${RURL}/uploads/${state.team1.logo}`;
            }
            if (state.team2.logo) {
                document.querySelector('.team-right .logo img').src = `${RURL}/uploads/${state.team2.logo}`;
            }
        } catch (error) {
            console.error('Failed to load state:', error);
        }
    }

    // Poll the server every second to update the scoreboard
    setInterval(loadStateFromAPI, 1000);

    // Initial load
    loadStateFromAPI();
});
