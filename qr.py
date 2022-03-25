
import cv2
import os


# TODO:
# - fix bug where scanner fails upon seeing a new QR code while there is an unfinished QR code being scanned 
#   that has not already been completely scanned

cap = cv2.VideoCapture(0)
# initialize the cv2 QRCode detector
detector = cv2.QRCodeDetector()

curQR = []
prevQR = []
QRidx = 0


# if the file with the name qr.csv doesn't exist, create an empty file
if not os.path.isfile('qr.csv'):
    with open('qr.csv', 'w') as f:
        f.write('')

while True:
    _, img = cap.read()

    # display webcam image to user
    cv2.imshow('Webcam', img)

    # detect and decode
    data, bbox, _ = detector.detectAndDecode(img)

    if data != "":
        cPieces = data.split("C", 1)
        lPieces = cPieces[1].split("L", 1)
        QRidx = int(cPieces[0])
        QRcnt = int(lPieces[0])
        dataStr = lPieces[1]

        if QRcnt != len(prevQR) or (QRcnt == len(prevQR) and prevQR[QRidx] != dataStr):
            if len(curQR) == 0:
                curQR = [None] * QRcnt
            
            curQR[QRidx] = dataStr

        if all(curQR) and len(curQR) > 0:
            prevQR = curQR

            qr = "".join(curQR)

            name = qr.split(',')[12]

            print(name)

            if qr[-1] != ',':
                qr += ','

            # open file for writing and reading
            with open('qr.csv', 'r+') as csvfile:
                # split file into lines by \n
                lines = csvfile.readlines()
                for i in range(len(lines)):
                    lines[i] = lines[i].replace('\n', '')

                # check if the qr code is already in the file
                if qr not in lines:
                    # write the qr code to the file
                    csvfile.write(qr + '\n')
                    print(">>>>> QR code added to file <<<<<")

            curQR = []

    if cv2.waitKey(1) == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()