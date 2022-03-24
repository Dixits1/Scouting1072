// use raw javacsript without jquery, babel, or any other library

// TODOs:
// add reset button to climb time
// auto-start climb timer when page is opened
// show team numbers as options pulled from TBA instead of user-entered text

// EVENT_CODE = "2022cada";
EVENT_CODE = "2022flwp";
HEADERS = ["1072 Scouting", "Auton", "Teleop", "Endgame", "Comments", "QR Code"];
ARRAY_DELIM = "|";

timerIntervals = {"brick-timer": null, "climb-timer": null, "defense-timer": null};
timerVals = {"brick-timer": 0, "climb-timer": 0, "defense-timer": 0};
curPage = 0

curShotPosition = null;
shotPositions = [];
shotOutcomes = [];
numAutonScored = 0;
fieldFlipped = false;
qrHasBeenGenerated = false;


N_COLS = 5;
N_ROWS = 4;


document.addEventListener("DOMContentLoaded", function(){
    getSchedule(EVENT_CODE);

    // get all elements with class "content" and hide all but the first one
    content = document.getElementsByClassName('content');

    for (let i = 1; i < content.length; i++)
        content[i].style.display = 'none';

    fields = document.getElementsByClassName("field");

    genFieldElements();

    document.getElementById("no-climb").checked = true;

    const interval = setInterval(function() {
        // in qr-div, get the index of the child which has the style of display set to "block"
        let qrDiv = document.getElementById("qr-div");
        let nQRs = qrDiv.children.length;

        if (nQRs > 1) {
            let qrIndex = 0;

            for(let i = 0; i < nQRs; i++) {
                if(!qrDiv.children[i].classList.contains("hidden")) {
                    qrIndex = i;
                    break;
                }
            }

            if (qrIndex < nQRs - 1) {
                // set the style of the current QR code to hidden
                qrDiv.children[qrIndex].classList.add("hidden");

                qrDiv.children[qrIndex + 1].classList.remove("hidden");
            }
            else {
                qrDiv.children[qrIndex].classList.add("hidden");

                qrDiv.children[0].classList.remove("hidden");
            }
        }
        else if (nQRs == 1) {
            qrDiv.children[0].classList.remove("hidden");
        }
      }, 500);
});

function prevPage() {
    curPage--;
    updateCurrentPage();

    stopAllTimers();
}

function nextPage() {
    curPage++;
    updateCurrentPage();

    stopAllTimers();

    if(curPage == 1)
        resetForm();
    
    if(curPage == 2)
        numAutonScored = shotPositions.length;
    
    if(curPage == 5) {
        data = getData();
        
        // get values from data and store as a comma separated list
        // if the value is an array, then surround each non-numerical value with single-quotes, otherwise don't 
        //surround with any single-quotes. then join those values with commas and surround the entire concatenated array
        // with brackets.
        let values = [];
        for(let key in data) {
            let value = data[key];
            if(Array.isArray(value)) {
                let newValue = [];
                for(let i = 0; i < value.length; i++) {
                    if(!isNaN(value[i]))
                        newValue.push(value[i]);
                    else
                        newValue.push(`'${value[i]}'`);
                }
                value = `[${newValue.join(ARRAY_DELIM)}]`;
            }
            values.push(value);
        }

        // concatenate the values into a single string
        let dataString = values.join(',');

        console.log(dataString);
        
        while (document.getElementById('qr-div').firstChild) {
            document.getElementById('qr-div').removeChild(document.getElementById('qr-div').firstChild);
        }

        let chunks = []

        // split dataString into chunks of length 40
        for(let i = 0; i < dataString.length; i += 20) {
            chunks.push(dataString.substring(i, i + 20));
        }

        for(let i = 0; i < chunks.length; i++) {
            generateQR(i + "C" + chunks.length + "L" + chunks[i]);
        }

        // add the "hidden" class to all children of the qr-div
        let qrDiv = document.getElementById("qr-div");
        for(let i = 1; i < qrDiv.children.length; i++) {
            qrDiv.children[i].classList.add("hidden");
        }
    }
}

function stopAllTimers() {
    // get all timer elements
    let timers = document.getElementsByClassName("timer-ss");

    // stop all timers
    for(let i = 0; i < timers.length; i++) {
        timers[i].classList.remove('timer-running');
        timers[i].classList.add('timer-stopped');
        timers[i].innerHTML = "Start";
    }

    // set all values in timerIntervals to null
    for(let key in timerIntervals) {
        if (timerIntervals[key] != null) {
            clearInterval(timerIntervals[key]);
            timerIntervals[key] = null;
        }
    }
}

function PosToRowCol(pos) {
    row = Math.ceil(pos / N_COLS);
    col = pos % N_COLS == 0 ? N_COLS : pos % N_COLS;

    return {row, col}
}

function RowColToPos(row, col) {
    return (row - 1) * N_COLS + col;
}

function getData() {
    let data = {};

    data["match"] = document.getElementById("data-match-number").value;
    data["team"] = document.getElementById("data-team-number").value;
    data["teamColor"] = getAllianceColor(data["team"], data["match"]);

    data["locations"] = shotPositions;
    data["shots"] = shotOutcomes;

    if ((fieldFlipped && data["teamColor"] == "blue") || (!fieldFlipped && data["teamColor"] == "red")) {
        flippedLocations = []
        for (let i = 0; i < data["locations"].length; i++) {
            flippedLocations.push(20 - data["locations"][i] + 1);
        }
        data["locations"] = flippedLocations;
    }

    // get the index of the selected radio button for the radios with name of "data-climb-level"
    let climbLevel = document.querySelector('input[name="data-climb-level"]:checked');
    data["climb"] = Array.prototype.indexOf.call(climbLevel.parentNode.parentNode.children, climbLevel.parentNode);
    data["initiationLine"] = document.getElementById("data-initiation-line").checked;
    data["autonCount"] = numAutonScored;
    data["humanPlayerScored"] = document.getElementById("data-hp-scored").checked;
    data["climbTime"] = Math.trunc(timerVals["climb-timer"] / 1000.0);
    data["brickTime"] = Math.trunc(timerVals["brick-timer"] / 1000.0);
    data["defenseTime"] = Math.trunc(timerVals["defense-timer"] / 1000.0);

    data["scouterName"] = document.getElementById("data-scouter-name").value;

    data["comments"] = document.getElementById("data-comments").value;

    return data;
}

// function rotateShots180(shotPosArr) {
//     let newPositions = [];

//     for(let i = 0; i < shotPosArr.length; i++) {
//         // get row and col form of shot position
//         let {row, col} = PosToRowCol(shotPosArr[i]);

//         // rotate row and col by 180 degrees
//         row = N_ROWS - (row - 1);
//         col = N_COLS - (col - 1);

//         // convert row and col back to position
//         newPositions.push(RowColToPos(row, col));
//     }

//     return newPositions;
// }

// function flipShotsHorizontally(shotPosArr) {
//     let newPositions = [];

//     for(let i = 0; i < shotPosArr.length; i++) {
//         // get row and col form of shot position
//         let {row, col} = PosToRowCol(shotPosArr[i]);

//         // flip col
//         col = N_COLS - (col - 1);

//         // convert row and col back to position
//         newPositions.push(RowColToPos(row, col));
//     }

//     return newPositions;
// }


function updateCurrentPage() {
    if (curPage < 0) {
        if (qrHasBeenGenerated)
            curPage = HEADERS.length - 1;
        else
            curPage = 0;
    }

    if (curPage > HEADERS.length - 1)
        curPage = 0;

    const content = document.getElementsByClassName('content');

    for (let i = 0; i < content.length; i++) {
        content[i].style.display = i == curPage ? 'flex' : 'none';
    }

    document.getElementById('header').innerHTML = HEADERS[curPage];
}

function resetForm() {
    // uncheck the input with the id of "data-initiation-line"
    document.getElementById("data-initiation-line").checked = false;
    // uncheck the input with the id of "data-hp-scored"
    document.getElementById("data-hp-scored").checked = false;

    // clear all radio button inputs with the name of "data-climb-level"
    let climbLevels = document.getElementsByName("data-climb-level");
    for(let i = 0; i < climbLevels.length; i++) {
        climbLevels[i].checked = false;
    }

    document.getElementById("no-climb").checked = true;

    // clear textarea with id of "data-comments"
    document.getElementById("data-comments").value = "";

    clearFields();
    clearTimers();
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
        stopAllTimers();
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
        
        clearInterval(timerIntervals[timerName])

        timerIntervals[timerName] = null;
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

function addShot(e, el) {
    // e - event
    // el - element

    let offset = {
        x: e.clientX - el.getBoundingClientRect().left,
        y: e.clientY - el.getBoundingClientRect().top
    };
    
    row = Math.floor(offset.y / (el.offsetHeight / (N_ROWS * 1.0))) + 1;
    col = Math.floor(offset.x / (el.offsetWidth / (N_COLS * 1.0))) + 1;

    gridArea = `${row} / ${col} / ${row + 1} / ${col + 1}`;

    fields = document.getElementsByClassName("field");
    for (let k = 0; k < fields.length; k++) {
        // iterate over children and see if any of them have the same grid-area as gridArea
        for (let i = 0; i < fields[k].children.length; i++) {
            if (fields[k].children[i].style.gridArea == gridArea) {
                fields[k].children[i].classList.add('field-label-shaded');
                break;
            }
        }
    }

    curShotPosition = RowColToPos(row, col);
    
    toggleModal();
}

function generateQR(text) {

    qrHasBeenGenerated = true;

    var options_object = {
        text: text,
        width: getQRSize(),
        height: getQRSize(),
        colorDark : "#000000",
        colorLight : "#f4f4f4",
        correctLevel : QRCode.CorrectLevel.H
    }

    var qrcode = new QRCode(document.getElementById('qr-div'), options_object);
}

function toggleModal() {
    document.querySelector(".modal").classList.toggle("show-modal");
}

function closeModal() {
    let {row, col} = PosToRowCol(curShotPosition);

    fields = document.getElementsByClassName("field");

    for (let k = 0; k < fields.length; k++) {
        // iterate over children and see if any of them have the same grid-area as gridArea
        for (let i = 0; i < fields[k].children.length; i++) {
            if (fields[k].children[i].style.gridArea == `${row} / ${col} / ${row + 1} / ${col + 1}`) {
                fields[k].children[i].classList.remove('field-label-shaded');
                break;
            }
        }
    }

    toggleModal();
}

function addShotOutcome(el) {
    shotPositions.push(curShotPosition);
    shotOutcomes.push(el.innerHTML.toLowerCase()[0]);

    curShotPosition = null;

    toggleModal();
}

function flipField() {
    let fields = document.getElementsByClassName("field");

    for (let k = 0; k < fields.length; k++) {
        fields[k].classList.toggle("field-flipped");
    }

    fieldFlipped = !fieldFlipped;
}

function clearFields() {
    let fields = document.getElementsByClassName("field");

    // remove all children from each field
    for (let k = 0; k < fields.length; k++) {
        while (fields[k].firstChild) {
            fields[k].removeChild(fields[k].firstChild);
        }
    }

    genFieldElements();

    shotPositions = [];
    shotOutcomes = [];
}

function clearTimers() {
    // set all timerIntervals to null
    // set all timerVals to 0
    for (let key in timerIntervals) {
        if (timerIntervals[key] != null) {
            clearInterval(timerIntervals[key]);
        }
        timerIntervals[key] = null;
        timerVals[key] = 0;
    }

    // set the innerHTML of all elements with the timer-text class to "00:00"
    let timerTexts = document.getElementsByClassName("timer-text");

    for (let i = 0; i < timerTexts.length; i++) {
        timerTexts[i].innerHTML = "00:00";
    }
}

function genFieldElements() {
    for(let k = 0; k < fields.length; k++) {
        for (let i = 0; i < N_ROWS; i++) {
            for (let j = 0; j < N_COLS; j++) {
                let newDiv = document.createElement('div');
                newDiv.style.gridArea = `${i + 1} / ${j + 1} / ${i + 2} / ${j + 2}`;
                fields[k].appendChild(newDiv);
            }
        }
    }
}

function undoShot() {
    if (shotPositions.length > 0) {
        lastShotPos = shotPositions.pop();
        shotOutcomes.pop();

        fields = document.getElementsByClassName("field");

        // derive the row and col based on lastShotPos
        let {row, col} = PosToRowCol(lastShotPos);

        for (let k = 0; k < fields.length; k++) {
            // iterate over children and see if any of them have the corresponding grid-area to row and col
            for (let i = 0; i < fields[k].children.length; i++) {
                if (fields[k].children[i].style.gridArea == `${row} / ${col} / ${row + 1} / ${col + 1}`) {
                    fields[k].children[i].classList.remove('field-label-shaded');
                    break;
                }
            }
        }
    }
}

function getQRSize() {
    // get screen width and height
    return Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7);
}

function updateTeams() {
    // get match id from element with id of "data-match-number"
    matchNum = document.getElementById("data-match-number").value;

    if (schedule) {
        // get item in schedule list with the attribute "key" of EVENT_CODE + "_qm" + matchNum
        match = schedule.find(item => item.key == EVENT_CODE + "_qm" + matchNum);

        if (match) {
            blueTeam = match.alliances.blue.team_keys.map(x => x.substring(3));
            redTeam = match.alliances.red.team_keys.map(x => x.substring(3));

            // create radio buttons for the red team selections and blue team selections
            // make textfield uneditable if radio buttons are selected
        }
        else {
            document.getElementById("data-match-number").value = "";
        }
    }
}

function getAllianceColor(teamNum, matchNum) {
    if (schedule) {
        match = schedule.find(item => item.key == EVENT_CODE + "_qm" + matchNum);

        if (match) {
            blueTeam =  match.alliances.blue.team_keys.map(x => x.substring(3));
            redTeam =  match.alliances.red.team_keys.map(x => x.substring(3));

            if (blueTeam.includes(teamNum)) {
                return "blue";
            }
            else if (redTeam.includes(teamNum)) {
                return "red";
            }
        }
    }

    return "N/A";

}