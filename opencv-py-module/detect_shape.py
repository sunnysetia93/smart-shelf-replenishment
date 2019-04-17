# import the necessary packages
from shape_detector import ShapeDetector
import argparse
import imutils
import cv2
import numpy as np
import threading
import os
from area import detect_area
import time
import base64
import zmq
import json


context = zmq.Context()
publisher = context.socket(zmq.PUB)
publisher.bind("tcp://192.168.43.158:9000")

cap = cv2.VideoCapture(0)
count = 0
sa1 = sa2 = 0
i = 0
per1 = per2 = 0
while (True):

    # print(count)
    if(count % 30000000 == 0):
        ret, frame = cap.read()
        # cv2.waitKey()
        if i == 0:
            i = 1
        elif i == 1:

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray = cv2.bilateralFilter(gray, 1, 10, 120)

            edges = cv2.Canny(gray, 10, 250)

            kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))

            closed = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel)

            cnts = cv2.findContours(closed.copy(), cv2.RETR_EXTERNAL,
                                    cv2.CHAIN_APPROX_SIMPLE)
            cnts = imutils.grab_contours(cnts)
            sd = ShapeDetector()

            c = max(cnts, key=cv2.contourArea)
            mask = np.zeros_like(frame)
            cv2.drawContours(mask, [c], -1, (255, 255, 255), -1)
            out = np.zeros_like(frame)
            out[mask == 255] = frame[mask == 255]

            (x, y, z) = np.where(mask == 255)
            (topx, topy) = (np.min(x), np.min(y))
            (bottomx, bottomy) = (np.max(x), np.max(y))
            total = bottomx-topx
            partition = int(total/2)
            # print(topx, topy, bottomx, bottomy)
            one = out[topx:topx+partition+25, topy:bottomy, ]
            two = out[topx+(1*partition+10):topx+(2*partition), topy:bottomy]
            # three = out[topx+(2*partition):topx+(3*partition), topy:bottomy]
            # cv2.imshow("thresh", out)
            cv2.imshow('one', one)
            cv2.imshow('two', two)
            cv2.imwrite("one.jpg", one)
            cv2.imwrite("two.jpg", two)

            # cv2.waitKey()

            # cv2.imwrite("one.jpg", one)
            # cv2.imwrite("two.jpg", two)
            if(sa1 == 0):
                per1, sa1 = detect_area(one, 0)
                print("surface area of 1>>>>>>>>>>>>>>>>>>>")
                print(sa1)
            else:
                per1, sa1 = detect_area(one, sa1)
                print("per of 1>>>>>>>>>>>>>>>>>>>")
                print(per1)
                # if (per1) > 70.0:
                # print("hello please work per1")
                text = "Available space: "+str(round(per1, 2))+"%"
                cv2.putText(frame, text, (150, 100),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

                # elif 30.0 < (per1) < 70.0:
                #     text = str(round(per1, 2))+"%"
                #     cv2.putText(frame, text, (topx, topx+10+partition),
                #                 cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

            if(sa2 == 0):
                per2, sa2 = detect_area(two, 0)
                print("surface area of 2>>>>>>>>>>>>>>>>>>>")
                print(sa2)
            else:
                per2, sa2 = detect_area(two, sa2)
                print("per of 2>>>>>>>>>>>>>>>>>>>")
                print(per2)
                # if (per2) > 70.0:
                text = "Available space: "+str(round(per2, 2))+"%"
                cv2.putText(frame, text, (150, 350),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

                # elif 30.0 < (per2) < 70.0:
                #     text = str(round(per2, 2))+"%"
                #     cv2.putText(frame, text, (topx+(1*partition+10), topx+(2*partition)),
                #                 cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200, 255, 255), 2)

            cv2.imshow("frame.jpg", frame)
            encoded, buffer = cv2.imencode('.jpg', frame)
            jpg_as_text = base64.b64encode(buffer)
            # print(jpg_as_text)
            json_file = {
                "image": str(jpg_as_text),
                "per1" : round(per1, 2),
                "per2" : round(per2, 2)

            }
            json1=json.dumps(json_file)
            publisher.send_string(json1)
            # cv2.waitKey()
            if cv2.waitKey(10) == 27:
                break

    count = count+1
