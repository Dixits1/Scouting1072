
import cv2


cap = cv2.VideoCapture(0)
# initialize the cv2 QRCode detector
detector = cv2.QRCodeDetector()

curQR = []
nQRs = 1
QRidx = 0



while True:
    _, img = cap.read()

    # detect and decode
    data, bbox, _ = detector.detectAndDecode(img)
    # check if there is a QRCode in the image
    if data != "":
        if len(curQR) == 0:
            QRidx = data.split("C", 1)[0]
            data = data.split("C", 1)[1]
            nQRs = data.split("L", 1)[0]
            curQR = [None] * int(nQRs)

            curQR[QRidx] = data.split("L", 1)[1]

        else:
            QRidx = data.split("C", 1)[0]
            data = data.split("C", 1)[1]
            nQRsCur = data.split("L", 1)[0]

            curQR[QRidx] = data.split("L", 1)[1]

        if all(curQR):
            qr = "".join(curQR)

            print(qr)
            curQR = []

        
        

    # if bbox is not None:
    #     # save image to a file named "frame.jpg"
    #     cv2.imwrite("frame.jpg", img)

    if cv2.waitKey(1) == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()