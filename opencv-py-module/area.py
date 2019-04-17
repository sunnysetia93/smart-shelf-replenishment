import cv2
import numpy as np
import time


def detect_area(image, surface_area):
    # cv2.imshow("inArea",image)
    per = 0
    gaussian = cv2.GaussianBlur(image, (5, 5), 0)
    gray = cv2.cvtColor(gaussian, cv2.COLOR_BGR2GRAY)

    _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

    # hsv_image = cv2.cvtColor(gaussian, cv2.COLOR_BGR2HSV)
    # lower_hsv = np.array([49,63,63])
    # upper_hsv = np.array([125,136,138])
    # mask = cv2.inRange(hsv_image, lower_hsv, upper_hsv)

    im, contours, hierarchy = cv2.findContours(
        thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    areas = [cv2.contourArea(c) for c in contours]
    # print(areas)
    cnt = contours[np.argmax(areas)]
    cv2.drawContours(image, [cnt], 0, (0, 0, 255), -1)
    area = cv2.contourArea(cnt)
    print("......................")
    print(surface_area, area)
    if surface_area == 0:
        surface_area = area
    if surface_area < area:
        per = ((area-surface_area)/surface_area)*100

    elif surface_area > area:
        per = ((surface_area-area)/surface_area)*100
        print("per inside AREA>>>>>>>>>>>>>>>>")
        print(per)
        # print(area)
    # print(per)

    # if (100.0-per) > 70.0:
    #     text = str(100.0-per)
    #     cv2.putText(frame, text, (50, 20),
    #                 cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200, 255, 255), 2)

    # if 30.0< (100.0-per) < 70.0:
    #     text = str(100.0-per)
    #     cv2.putText(frame, text, (50, 20),
    #                 cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200, 255, 255), 2)

    # print(surface_area,area)
    cv2.imshow("color", image)
    # time.sleep(30)
    return per, surface_area



    # cv2.waitKey()


# image= cv2.imread("two.jpg")
# detect_area(image)
# area= cv2.contourArea()
