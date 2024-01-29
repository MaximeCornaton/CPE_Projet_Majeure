from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from pose_detection_class import PoseProcessor
import random
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Unique identifier for each Flask instance
flask_identifier = str(random.randint(1000, 9999))

# Global variable to control the loop
running_loop = True

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    socketio.emit('ID_transfer', flask_identifier)
    #   socketio.start_background_task(target=emit_data)

@socketio.on('launch_process')
def start_loop():
    global running_loop, poseProcessor
    poseProcessor = PoseProcessor()
    print('Starting the loop')
    running_loop = True
    emit_data()

@socketio.on('stop_process')
def stop_loop():
    global running_loop
    print('Stopping the loop')
    running_loop = False

def emit_data():
    global running_loop
    while running_loop:
        poseProcessor.process_data()

        data = {'data': poseProcessor.get_data(), 'type': poseProcessor.get_type(), 'id': flask_identifier}
        socketio.emit('transfer', data)

        #time.sleep(0.1)
        #socketio.sleep(1)

if __name__ == '__main__':
    try:
        poseProcessor = PoseProcessor()
        socketio.run(app, port=5001)
    except Exception as e:
        print(f"An error occurred: {str(e)}")

