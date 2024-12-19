from flask import Flask, render_template, request, jsonify, send_from_directory
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS

instance_url = os.getenv("INSTANCE_URL", "http://localhost:5000")
app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app, origins=["http://127.0.0.1", "http://localhost", "http://[::1]",instance_url])

# Set a path for static files
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max file size 16 MB

# Initial scoreboard state
scoreboard_state = {
    "team1": {"name": "Team 1", "score": 0, "color": "#FFFFFF", "logo": None},
    "team2": {"name": "Team 2", "score": 0, "color": "#FFFFFF", "logo": None},
    "game_time": "00:00",
    "time_retrieved": 0,
}

@app.route('/')
def index():
    return render_template('index.html')  # Serve the scoreboard page

@app.route('/editor')
def editor():
    return render_template('editor.html')  # Serve the editor page

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/scoreboard', methods=['GET'])
def get_scoreboard():
    return jsonify(scoreboard_state)

@app.route('/api/scoreboard', methods=['POST'])
def update_scoreboard():
    print(request.form)
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
            filename = 'team1_logo' + os.path.splitext(file.filename)[1]
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
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
            filename = 'team2_logo' + os.path.splitext(file.filename)[1]
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            scoreboard_state["team2"]["logo"] = filename

    # Update game time
    if request.form.get('update_time'):
        scoreboard_state["game_time"] = request.form.get('game_time', scoreboard_state["game_time"])

    package = jsonify({"message": "Scoreboard updated successfully", "state": scoreboard_state})
    
    # Reset game time after retrieval
    if scoreboard_state["time_retrieved"] >= 1:
        scoreboard_state["game_time"] = None
        scoreboard_state["time_retrieved"] = 0
    else:
        scoreboard_state["time_retrieved"] += 1

    return package

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(host='0.0.0.0', port=5000)
