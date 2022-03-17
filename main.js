// use raw javacsript without jquery, babel, or any other library

HEADERS = ["1072 Scouting", "Auton", "Teleop", "Endgame", "Comments", "QR Code"];

timerIntervals = {"brick-timer": null, "climb-timer": null, "defense-timer": null};
timerVals = {"brick-timer": 0, "climb-timer": 0, "defense-timer": 0};
curPage = 0
fieldLabels = []


N_COLS = 5;
N_ROWS = 4;


document.addEventListener("DOMContentLoaded", function(){
    // get all elements with class "content" and hide all but the first one
    const content = document.getElementsByClassName('content');

    for (let i = 1; i < content.length; i++)
        content[i].style.display = 'none';

    for (let i = 0; i < N_ROWS; i++) {
        fieldLabels[i] = [];
        for (let j = 0; j < N_COLS; j++)
            fieldLabels[i][j] = "";
    }

    generateQR("testQRCodetextABCDEFG");

});

function prevPage() {
    curPage--;
    updateCurrentPage();
}

function nextPage() {
    curPage++;
    updateCurrentPage();

    if(curPage == 1)
        resetForm();
}


function updateCurrentPage() {
    if (curPage < 0)
        curPage = HEADERS.length - 1;

    if (curPage > HEADERS.length - 1)
        curPage = 0;

    const content = document.getElementsByClassName('content');

    for (let i = 0; i < content.length; i++) {
        content[i].style.display = i == curPage ? 'block' : 'none';
    }

    document.getElementById('header').innerHTML = HEADERS[curPage];
}

function resetForm() {
// TODO: write this function
}

function toggleTimer(e) {
    curTimeSpan = e.parentNode.getElementsByTagName('span')[0];
    
    timerName = "";
    
    classList = curTimeSpan.classList;
    
    for (let i = 0; i < classList.length; i++) {
        if (classList[i].endsWith("-timer")) {
            timerName = classList[i];
            break;
        }
    }

    if(e.classList.contains('timer-stopped')) {
        e.classList.add('timer-running');
        e.classList.remove('timer-stopped');
        e.innerHTML = "Stop";

        elapsedTime = timerVals[timerName];
        startTime = Date.now() - elapsedTime;

        equivTimers = document.getElementsByClassName(timerName);

        timerIntervals[timerName] = setInterval(function() {
            timerVals[timerName] = Date.now() - startTime;
            for (let i = 0; i < equivTimers.length; i++)
                equivTimers[i].innerHTML = timeToString(timerVals[timerName]);
        }, 1000);
    }
    else {
        e.classList.remove('timer-running');
        e.classList.add('timer-stopped');
        e.innerHTML = "Start";
        
        timerIntervals[timerName] = clearInterval(timerIntervals[timerName]);
    }
}

// https://codepen.io/bnsddk/pen/pojMGGN
function timeToString(time) {
  let diffInHrs = time / 3600000;
  let hh = Math.floor(diffInHrs);

  let diffInMin = (diffInHrs - hh) * 60;
  let mm = Math.floor(diffInMin);

  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);

  let diffInMs = (diffInSec - ss) * 100;
  let ms = Math.floor(diffInMs);

  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");
  let formattedMS = ms.toString().padStart(2, "0");

  return `${formattedMM}:${formattedSS}`;
}

function addDot(e, el) {

    fontSize = Math.min(el.offsetWidth / N_COLS, el.offsetHeight / N_ROWS) - 20;

    newSpan = document.createElement('div');
    newSpan.classList.add('field-label');
    newSpan.style.fontSize = fontSize + "px";
    newSpan.innerHTML = "U";

    x = e.offsetX;
    y = e.offsetY;

    row = Math.floor(y / (el.offsetHeight / (N_ROWS * 1.0))) + 1;
    col = Math.floor(x / (el.offsetWidth / (N_COLS * 1.0))) + 1;

    // leftMargin = (col * (el.offsetWidth / 5.0)) + (el.offsetWidth / 10.0);
    // topMargin = (row * (el.offsetHeight / 4.0)) + (el.offsetWidth / 10.0);

    newSpan.style.gridArea = `${row} / ${col} / ${row + 1} / ${col + 1}`;

    el.appendChild(newSpan);
}

function generateFieldLabels(parent) {

    fontSize = Math.round(Math.min(el.offsetWidth / N_COLS, el.offsetHeight / N_ROWS) * 0.8);

    fieldLabels = [];

    for (let i = 0; i < N_ROWS; i++) {
        fieldLabels[i] = [];
        for (let j = 0; j < N_COLS; j++) {
            let newDiv = document.createElement('div');
            newDiv.classList.add('field-label');
            newDiv.style.fontSize = fontSize + "px";
            newDiv.style.gridArea = `${i + 1} / ${j + 1} / ${i + 2} / ${j + 2}`;
            newDiv.innerHTML = "";

            fieldLabels[i].push("");

            parent.appendChild(newDiv);
        }

        fieldLabels.appendChild(row);
    }

    parent.appendChild(fieldLabels);
}

function generateQR(text) {

    var options_object = {
        text: text,
        width: 400,
        height: 400,
        colorDark : "#000000",
        colorLight : "#f4f4f4",
        correctLevel : QRCode.CorrectLevel.H
    }

    var qrcode = new QRCode(document.getElementById('qr-div'), options_object);
}