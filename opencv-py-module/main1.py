import base64
import cv2
import zmq
import requests
import json

context = zmq.Context()
publisher = context.socket(zmq.PUB)
publisher.bind("tcp://127.0.0.1:9001")

def sendFrames(buffer):
    jpg_as_text = base64.b64encode(buffer)
    publisher.send(jpg_as_text)
    return

camera = cv2.VideoCapture(1)
# camera.set(3,160)
# camera.set(4,120)

while True:
    try:
        grabbed, frame = camera.read()  # grab the current frame
        frame = cv2.resize(frame, (640, 480))  # resize the frame
        encoded, buffer = cv2.imencode('.jpg', frame)
        sendFrames(buffer)
    except KeyboardInterrupt:
        camera.release()
        cv2.destroyAllWindows()
        break
