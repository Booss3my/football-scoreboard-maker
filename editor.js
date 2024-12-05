import { Timer } from './timer.js'; // Import Timer class

const ENDPOINTS = {
    scoreboard: 'http://127.0.0.1:5000/api/scoreboard', // Flask backend endpoint
};

document.addEventListener('DOMContentLoaded', function () {
    // Initialize the Timer instance with default time "00:00"
    const gameTimeInput = document.getElementById('game-time');
    const timeDisplay = document.getElementById('time-display'); // Element to display the timer
    const timer = new Timer(timeDisplay, "45:00", (currentTime) => {
        timeDisplay.textContent = currentTime; // Update the display each second
    });

    // Fetch existing game time from the backend (optional)
    async function fetchInitialTime() {
        try {
            const response = await fetch(ENDPOINTS.scoreboard);
            if (response.ok) {      
                const data = await response.json();
                console.log("saved time",data.game_time);
                let savedTime = data.game_time || "00:00"; // Default if not available

                // Validate if savedTime is in valid MM:SS format
                if (!/^\d{2}:\d{2}$/.test(savedTime)) {
                    console.warn('Invalid time format, defaulting to 00:00');
                    savedTime = "00:00"; // Fallback to "00:00" if invalid format
                }
                
                // Use the setter method to set the time correctly
                timer.setStartTime(savedTime); // Update timer with fetched game time
                gameTimeInput.value = savedTime; // Display current time
            } else {
                console.warn('Failed to fetch initial time:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching initial time:', error);
        }
    }

    fetchInitialTime();

    // Start the timer and update the input field
    document.getElementById('start-timer').addEventListener('click', () => {
        timer.start(); // Start the timer
    });

    // Pause the timer
    document.getElementById('pause-timer').addEventListener('click', () => {
        timer.pause(); // Pause the timer
    });

    // Reset the timer
    document.getElementById('reset-timer').addEventListener('click', () => {
        timer.reset(); // Reset the timer
    });

    // Allow manual update of time via the input field
    gameTimeInput.addEventListener('input', () => {
        const newTime = gameTimeInput.value;
        timer.setStartTime(newTime); // Sync timer with input using the setter method
    });

    // Save button functionality
    document.getElementById('save-btn').addEventListener('click', async function () {
        const formData = new FormData();

        // Collect team 1 data
        if (document.getElementById('update-team1-name').checked) {
            formData.append('update_team1_name', true);
            formData.append('team1_name', document.getElementById('team1-name').value);
        }
        if (document.getElementById('update-team1-score').checked) {
            formData.append('update_team1_score', true);
            formData.append('team1_score', document.getElementById('team1-score').value);
        }
        if (document.getElementById('update-team1-color').checked) {
            formData.append('update_team1_color', true);
            formData.append('team1_color', document.getElementById('team1-color').value);
        }
        if (document.getElementById('update-team1-logo').checked) {
            const team1LogoFile = document.getElementById('team1-logo').files[0];
            if (team1LogoFile) {
                formData.append('team1_logo', team1LogoFile);
            }
        }

        // Collect team 2 data
        if (document.getElementById('update-team2-name').checked) {
            formData.append('update_team2_name', true);
            formData.append('team2_name', document.getElementById('team2-name').value);
        }
        if (document.getElementById('update-team2-score').checked) {
            formData.append('update_team2_score', true);
            formData.append('team2_score', document.getElementById('team2-score').value);
        }
        if (document.getElementById('update-team2-color').checked) {
            formData.append('update_team2_color', true);
            formData.append('team2_color', document.getElementById('team2-color').value);
        }
        if (document.getElementById('update-team2-logo').checked) {
            const team2LogoFile = document.getElementById('team2-logo').files[0];
            if (team2LogoFile) {
                formData.append('team2_logo', team2LogoFile);
            }
        }

        // Collect game time data
        if (document.getElementById('update-time').checked) {
            formData.append('update_time', true);
            formData.append('game_time', timer.formatTime(timer.elapsedTime)); // Use Timer's current time
        }

        try {
            // Send the data to the backend
            const response = await fetch(ENDPOINTS.scoreboard, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                alert('Scoreboard updated successfully!');
                console.log(result.state); // Debugging: Log the updated state
            } else {
                const error = await response.json();
                alert(`Error updating scoreboard: ${error.message}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An unexpected error occurred while updating the scoreboard.');
        }
    });
});


///////////////////////////// Logos
document.getElementById('team1-logo').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById('team1-logo-preview');
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = ''; // Clear preview if no file is selected
    }
});

document.getElementById('team2-logo').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById('team2-logo-preview');
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = ''; // Clear preview if no file is selected
    }
});

///////////////////////////////////// Colors
document.getElementById('team1-color').addEventListener('input', function () {
    const colorPreview = document.getElementById('team1-color-preview');
    colorPreview.style.backgroundColor = this.value;
});

document.getElementById('team2-color').addEventListener('input', function () {
    const colorPreview = document.getElementById('team2-color-preview');
    colorPreview.style.backgroundColor = this.value;
});