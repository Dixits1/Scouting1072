// use raw javacsript without jquery, babel, or any other library

HEADERS = ["1072 Scouting", "Auton", "Teleop", "Endgame", "Comments", "QR Code"];

curPage = 0

timerIntervals = {"brick-timer": null, "climb-timer": null, "defense-timer": null};
timerVals = {"brick-timer": 0, "climb-timer": 0, "defense-timer": 0};

document.addEventListener("DOMContentLoaded", function(){
    // get all elements with class "content" and hide all but the first one
    const content = document.getElementsByClassName('content');

    for (let i = 1; i < content.length; i++)
        content[i].style.display = 'none';
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