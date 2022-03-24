
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
            cPieces = data.split("C", 1)
            QRidx = int(cPieces[0])
            dataL = cPieces[1]
            lPieces = dataL.split("L", 1)
            nQRs = int(lPieces[0])
            curQR = [None] * int(nQRs)

            curQR[QRidx] = lPieces[1]

        else:
            cPieces = data.split("C", 1)
            QRidx = int(cPieces[0])
            dataL = cPieces[1]
            lPieces = dataL.split("L", 1)
            nQRsCur = int(lPieces[0])

            curQR[QRidx] = lPieces[1]

        # print(curQR)
        # print(data)

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