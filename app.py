from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://0.0.0.0:5500"}})

# Set a path for static files (such as logos)
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}  # Specify allowed file types
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max file size 16 MB

# Initial scoreboard state
scoreboard_state = {
    "team1": {"name": "Team 1", "score": 0, "color": "#FFFFFF", "logo": None},
    "team2": {"name": "Team 2", "score": 0, "color": "#FFFFFF", "logo": None},
    "game_time": "00:00",
    "time_retrieved": 0,  # Track how many times game_time is retrieved
}

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Route to get the current scoreboard state
@app.route('/api/scoreboard', methods=['GET'])
def get_scoreboard():
    return jsonify(scoreboard_state)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "running"}), 200

# Route to update the scoreboard state
@app.route('/api/scoreboard', methods=['POST'])
def update_scoreboard():
    global scoreboard_state

    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

    # Update team 1 details
    if request.form.get('update_team1_name'):
        scoreboard_state["team1"]["name"] = request.form.get('team1_name', scoreboard_state["team1"]["name"])
    if request.form.get('update_team1_score'):
        scoreboard_state["team1"]["score"] = int(request.form.get('team1_score', scoreboard_state["team1"]["score"]))
    if request.form.get('update_team1_color'):
        scoreboard_state["team1"]["color"] = request.form.get('team1_color', scoreboard_state["team1"]["color"])
    if 'team1_logo' in request.files:
        file = request.files['team1_logo']
        if file and allowed_file(file.filename):
            filename = 'team1_logo' + os.path.splitext(file.filename)[1]  # Ensuring the logo is saved with the name "team1_logo"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            scoreboard_state["team1"]["logo"] = filename

    # Update team 2 details
    if request.form.get('update_team2_name'):
        scoreboard_state["team2"]["name"] = request.form.get('team2_name', scoreboard_state["team2"]["name"])
    if request.form.get('update_team2_score'):
        scoreboard_state["team2"]["score"] = int(request.form.get('team2_score', scoreboard_state["team2"]["score"]))
    if request.form.get('update_team2_color'):
        scoreboard_state["team2"]["color"] = request.form.get('team2_color', scoreboard_state["team2"]["color"])
        
    if 'team2_logo' in request.files:
        file = request.files['team2_logo']
        if file and allowed_file(file.filename):
            filename = 'team2_logo' + os.path.splitext(file.filename)[1]  # Ensuring the logo is saved with the name "team2_logo"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            scoreboard_state["team2"]["logo"] = filename

    # Update game time
    if request.form.get('update_time'):
        scoreboard_state["game_time"] = request.form.get('game_time', scoreboard_state["game_time"])

    package =jsonify({"message": "Scoreboard updated successfully", "state": scoreboard_state})
    print("retrieved ", scoreboard_state["time_retrieved"], "times")
    if scoreboard_state["time_retrieved"] >= 1:  # Allow 5 GET requests before resetting
        scoreboard_state["game_time"] = None
        scoreboard_state["time_retrieved"] = 0
    else:
        scoreboard_state["time_retrieved"] += 1
    return package

if __name__ == '__main__':
    # Create uploads folder if it doesn't exist
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(host='0.0.0.0', port=5000)

