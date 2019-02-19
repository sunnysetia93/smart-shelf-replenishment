import base64
import cv2
import zmq

context = zmq.Context()
publisher = context.socket(zmq.PUB)
publisher.bind("tcp://127.0.0.1:9000")

camera = cv2.VideoCapture(0)  # init the camera
# camera.set(3,160)
# camera.set(4,120)

while True:
    try:
        grabbed, frame = camera.read()  # grab the current frame
        frame = cv2.resize(frame, (640, 480))  # resize the frame
        encoded, buffer = cv2.imencode('.jpg', frame)
        jpg_as_text = base64.b64encode(buffer)
        publisher.send(jpg_as_text)
    except KeyboardInterrupt:
        camera.release()
        cv2.destroyAllWindows()
        break