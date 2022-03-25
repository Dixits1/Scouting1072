// use raw javacsript without jquery, babel, or any other library

// TODOs:
// add reset button to climb time
// auto-start climb timer when page is opened
// show team numbers as options pulled from TBA instead of user-entered text

// EVENT_CODE = "2022cada";
EVENT_CODE = "2022cada";
HEADERS = ["1072 Scouting", "Auton", "Teleop", "Endgame", "Comments", "QR Code"];
ARRAY_DELIM = "|";

BM_QUOTES = ["What is Red? How can you prove the Red you see is the Red others see? Its just labels","The Brain to notes synapse is much faster than limited app tracking.","Try doing that sheet over and over , not faster than paper, pen highlighters","Whatever… not trying to counter that as its non- stuff","The app is now on the back burner until they go though this entire season using our existing paper/excel /highlighter method.","Do you watch sports by reviewing stats? That is Fantasy football…fantasy.","Digital is 0 and 1, analog is infinite. Not that hard to understand…apps ARE digital. Human Brains are ANALOG","Most of the “app stuff” is driven by smartphones and an electronic generation","Look at Vegas , Vegas still wins despite card counters. Teams win for reasons other than fantastic scouting.","Most tracking systems are digital, we choose analog…so do Musicians both are valid","As for “scouting” :not found at all in last years Game and Season Manual","60-100 teams to track…not that hard some are good some are not.","I base most of our scouting off horse racing. Seems to work well.","Seems like scouting award is fluff. Same for strategy. Cream rises to the top","If students cant track 30-50 items without AI “help” there’s a problem Houston. ","weak waffle language","One of the biggest issues with Apps…they are limited by design , the human brain is not limited by constraints.","QR codes have been around for years not really that innovative in fact originally used in car manufacturing and everyone has seen them","I know personally how hard it is for a team to win a Blue Banner","There is not a single student that I have come across that sees the game like I do.","These notes need to be passionate and not just entries, written by someone who gets the goals of scouting.","Did Apollo use computers primarily? How about Jet travel? Or even discovering other continents ?","Better than “fancy app” they worked so hard on you can place that in Chairmans or something","Qualitative scouting is a completely valid way to track teams. The sample size is well within the scout teams ability to rank teams and find ways to use partners and defeat opponents.","Like any sport, you waste their time and frustrate them into fouls , while ahead then if they break you and go back to scoring 1 for 1 … you win. ","― Sun Tzu, The Art of War","Confirmation bias , the tendency to process information by looking for, or interpreting, information that is consistent with one’s existing beliefs.","Scouting is about overall performance, are they a good partner ? If foe how to defeat?","A “scouting form” is actually a terrible idea.","We do 100% Qualitative scouting (Excel scheds, paper, pen, highlighter and shorthand notes)","Correct name , never not correct","the whole thinking was app or bust . Until we spoke.","Yes leaving that debate to rest. I like Citrus Dad and respect his views, I have my own.","Know your own limitations and find solutions. Its simple. Observe. There is not an app for that IMO as an app has you looking down.","Blue alliance has plenty of data from FMS…watching closely tells you who is good. Pen , highlighter excel with watch lists.","Teams will lie, best to use you own eyes and only track what you need to form an event winning alliance","If the team makes eliminations/worlds before , they are very likely to win in the future. If they never make eliminations, then they are unlikely to do so in the future.","So everyone is a winner won? First robotics competition","I am not going to continue to express my opinions or scouting practices in this thread as they find it “off topic” as it wasn’t deemed “useful for future readers” hence the OP requested “clean up”.","And attacked by @ Stryker (with 18 loves) \"\"individual being notorious for sharing eccentric opinions without appropriate defenses for them. \"\"","Bye this thread enjoy your own opinions then, have at it","I’ll take a brain over and app…especially in a limited field size and low sample size","I don’t think this is at all different than sports or horse racing, same principles apply","What does that mean exactly, does a number tell you “pick me”? There are many ways to do scouting, that’s for certain","We track all sorts of weird stuff that changes year to year. Stuff we believe in.","Scouts are experienced talent evaluators who travel extensively for the purposes of watching athletes play their chosen sports and determining whether their set of skills and talents represent what is needed by the scout’s organization.","In the end if you do scouting well , you know your team well. Then its a matter of building the strongest alliance to have a good chance against all comers","Not true if you LEAVE… seriously stop trying to win this argument","Have you ever gone to a horse race with a new person that picks winners by “Cutesy Name”? It happens they pick a cute name and they win","I suspect most wins at regional and championship are simple pair ups…not driven by any scouting app.","Observation and notes can trump fancy new “just in” technology rich scouting app","Amazing the worlds best inventions were accomplished without a single computer.","Not that hard to “track” 30-50 teams in most competitions.","Note 3: Not following the crowd, can be beneficial (see 2009 financial “crisis”)","This scouting award will certainly be dominated by a subset of more boisterous teams","Back to Horseracing, if it was easy to pick a winner don’t you think with all the money involved , someone would create a program to pick a winner every time? Hasn’t happened.","Sure 1678 has a great record and would not have been “as great” without scouting doing its job.","No amount of notes will convey what a simple conversation can convey as humans take visual cues from each other.","Scouting involves luck. look at handicappers or stock brokers… its all luck finding the trend at the right time. There is no magic sauce. ","Golden Worm Blasters","I decided to comment based on my experience with students. No harm no foul. Sorry if a resolution was reached 3 mo ago","What scouting brings is Intelligence… this bodes well in team interactions and gives you the intelligence high ground in competition or picking.","The class handicapper judges the merits of a horse not by the time of his recent races, but by the type of company in which he has been competing","Dealing with say 50 teams and say 10 matches to rely on data pointing the way is problematic","I still dismiss your quaint notion Blue Banners don’t matter!","I will refine, ask away its about assembling the best pick list, right? I have much to offer there.","The single most important stat in horse racing is “class” don’t under estimate that quality. I’ve learned from experience there.","Don’t use apps","Look at music…CD/streaming are cheap and acceptabe, yet LP albums are purer.","We have [a blue banner]…strive for more every season. Not for everyone and thats fine","NOT season","This thread is a no win scenario and should end for the good of the game. Mods shut it down.","I me thinks get a lot of silent likes and that is a-ok there are still critical thinkers here.","winner winner chicken dinner"]

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

    randomizeBMQuote();
});

function randomizeBMQuote() {
    // choose random element from the BM_QUOTES array
    let quoteIdx = Math.floor(Math.random() * BM_QUOTES.length);
    quoteIdx = quoteIdx == BM_QUOTES.length ? BM_QUOTES.length - 1 : quoteIdx;
    document.getElementById("bm-quote").innerHTML = BM_QUOTES[quoteIdx];
}

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

        randomizeBMQuote();
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