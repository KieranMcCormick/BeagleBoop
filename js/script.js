var DATAURL = "https://beagle-boop.firebaseio.com/boards/";
var BOARDURL = "https://beagle-boop.firebaseio.com/boards.json";
var boardData;
var currentBoard = "none";
var multiplayerBoard = "none"

var currentBoardResults;
var currentBoardFinished = false;
var multiplayerBoardResults;
var multiplayerBoardFinished = false;

var UPDATEURL_START = "https://beagle-boop.firebaseio.com/boards/";
var UPDATEURL_ALERT = "/alert.json";
var UPDATEURL_SEED = "/seed.json";
var UPDATEURL_BLACKLIST = "/blacklist.json"
var UPDATEURL_RESULTS = "/results.json"
var UPDATEURL_RESULTS_FINISHED = "/results/gameFinished.json"

var UPDATEURL_LIVES = "lives";
var UPDATEURL_TIMETOANSWER = "timeToAnswer";

var gameFinishInterval;

var UPDATE_URL_END = [
    UPDATEURL_LIVES,
    UPDATEURL_TIMETOANSWER
];

$(document).ready(function () {
    $("#multiNone").click(function () { selectMultiplayerBoard("none") });

    $.get({
        url: BOARDURL
    })
        .done(function (data) {
            boardData = data;
            console.log("Data: ", boardData);

            for (board in boardData) {
                console.log(board)

                console.log(boardData[board])
                var item = $('#hiddenLink').clone();
                item.attr("id", "boardItem")
                item.attr("onclick", 'selectBoard("' + board + '")');
                item.text(capitalizeFirstLetter(board));
                $('#boardDropdown').append(item);

                var item2 = $('#hiddenLink').clone();
                item2.attr("id", "multiBoard" + board);
                item2.attr("onclick", 'selectMultiplayerBoard("' + board + '")');
                item2.text("VS: " + capitalizeFirstLetter(board));
                $('#multiplayerDropdown').append(item2);
            }

            console.log("Done.");
        })

    $('#updateButton').click(function () {
        var id = $(this).attr('id');

        var d = new Date();
        // var currentUnixTime = d.getTime();
        var seed = d.getTime().toString();
        putData(seed, currentBoard);
        if (multiplayerBoard != "none") {
            putData(seed, multiplayerBoard);
        }
        function updateUI() {
            $.get({
                url: BOARDURL
            })
                .done(function (data) {
                    boardData = data;

                    if (currentBoard != "none") {
                        $("#currentTimeToAnswer").text(boardData[currentBoard].timeToAnswer);
                        $("#currentLives").text(boardData[currentBoard].lives);
                    }

                })

        }
        //timeInterval = setInterval(updateUI, 1500);
    });

    function updateUI() {
        $.get({
            url: BOARDURL
        })
            .done(function (data) {
                boardData = data;

                if (currentBoard != "none") {
                    $("#currentTimeToAnswer").text(boardData[currentBoard].timeToAnswer);
                    $("#currentLives").text(boardData[currentBoard].lives);
                }

            })

    }
    timeInterval = setInterval(updateUI, 1000);

});

function putData(seed, board) {
    for (i in UPDATE_URL_END) {
        console.log("end: " + UPDATE_URL_END[i])
        $.ajax({
            method: "PUT",
            url: DATAURL + board + "/" + UPDATE_URL_END[i] + ".json",
            data: $("#" + UPDATE_URL_END[i]).val().toString()
        }).done(function (data) {
            console.log(UPDATE_URL_END[i] + ' updated')
        })
    }

    var blackList = []

    if ($('#accelerometer_tilt_left').is(":checked")) {
        blackList.push("ACCELEROMETER_TILT_LEFT")
    }
    if ($('#accelerometer_tilt_right').is(":checked")) {
        blackList.push("ACCELEROMETER_TILT_RIGHT")
    }
    if ($('#accelerometer_pitch_up').is(":checked")) {
        blackList.push("ACCELEROMETER_PITCH_UP")
    }
    if ($('#accelerometer_pitch_down').is(":checked")) {
        blackList.push("ACCELEROMETER_PITCH_DOWN")
    }
    if ($('#joystick_up').is(":checked")) {
        blackList.push("JOYSTICK_UP")
    }
    if ($('#joystick_down').is(":checked")) {
        blackList.push("JOYSTICK_DOWN")
    }
    if ($('#joystick_left').is(":checked")) {
        blackList.push("JOYSTICK_LEFT")
    }
    if ($('#joystick_right').is(":checked")) {
        blackList.push("JOYSTICK_RIGHT")
    }
    if ($('#joystick_center').is(":checked")) {
        blackList.push("JOYSTICK_CENTER")
    }
    if ($('#potentiometer').is(":checked")) {
        blackList.push("POTENTIOMETER_TURN")
    }
    if ($('#button_squence').is(":checked")) {
        blackList.push("BUTTON_SEQUENCE")
    }
    $.ajax({
        method: "PUT",
        url: DATAURL + board + UPDATEURL_BLACKLIST,
        data: JSON.stringify(blackList)
    }).done(function (data) {
        console.log('Blacklist updated')
    })

    $.ajax({
        method: "PUT",
        url: DATAURL + board + UPDATEURL_SEED,
        data: seed
    }).done(function (data) {
        console.log('Seed updated')
    })

    $.ajax({
        method: "PUT",
        url: DATAURL + board + UPDATEURL_ALERT,
        data: "true"
    }).done(function (data) {
        console.log('Alert updated')
    })
    if (multiplayerBoard != "none" && board == currentBoard) {
        console.log("setting multi results interval")
        gameFinishIntervalMulti = setInterval(checkForResultsMulti, 1000);

        //checkForResultsMulti();
    } else if (multiplayerBoard == "none") {
        console.log("setting solo results interval")

        gameFinishInterval = setInterval(checkForResults, 1000);

        //checkForResults();        
    }
}

function checkForResults() {
    $.get({
        url: DATAURL + currentBoard + UPDATEURL_RESULTS
    })
        .done(function (data) {
            console.log(DATAURL + currentBoard + UPDATEURL_RESULTS)
            boardData = data;
            console.log("Got solo results")
            console.log(boardData)
            console.log(boardData.gameFinished)
            if (boardData) {
                console.log("inner")
                console.log(boardData.gameFinished)
                if (boardData.gameFinished) {
                    console.log("solo marked finished")

                    clearInterval(gameFinishInterval)
                    currentBoardResults = boardData;
                    setCurrentBoardResults();
                    $.ajax({
                        method: "PUT",
                        url: DATAURL + currentBoard + UPDATEURL_RESULTS_FINISHED,
                        data: "false"
                    }).done(function (data) {
                        console.log('Alert updated')
                    })
                }
            }
        })

}

function checkForResultsMulti() {
    if (!currentBoardFinished) {
        $.get({
            url: DATAURL + currentBoard + UPDATEURL_RESULTS
        })
            .done(function (datap1) {
                boardData = datap1;
                console.log("Got multi results p1")
                console.log(boardData)
                console.log(boardData.gameFinished)
                if (boardData) {
                    if (boardData.gameFinished) {
                        console.log("p1 finished")
                        currentBoardResults = boardData;
                        currentBoardFinished = true;
                    }
                }
            })
    }
    if (!multiplayerBoardFinished) {
        $.get({
            url: DATAURL + multiplayerBoard + UPDATEURL_RESULTS
        })
            .done(function (datap2) {
                boardData = datap2;
                console.log("Got multi results p2")
                if (boardData) {
                    if (boardData.gameFinished) {
                        console.log("p2 finished")
                        multiplayerBoardResults = boardData;
                        multiplayerBoardFinished = true;
                    }
                }
            })
    }
    console.log("Checking if both finished")
    if (currentBoardFinished && multiplayerBoardFinished) {
        clearInterval(gameFinishIntervalMulti)
        console.log("both finished")
        setMultiplayerBoardResults();
        setCurrentBoardResults();
        multiplayerBoardFinished = false;
        currentBoardFinished = false;
        $.ajax({
            method: "PUT",
            url: DATAURL + currentBoard + UPDATEURL_RESULTS_FINISHED,
            data: "false"
        }).done(function (data) {
            console.log('Alert updated')
        })
        $.ajax({
            method: "PUT",
            url: DATAURL + multiplayerBoard + UPDATEURL_RESULTS_FINISHED,
            data: "false"
        }).done(function (data) {
            console.log('Alert updated')
        })

    }
}


function setCurrentBoardResults() {
    $('#player1Name').html(currentBoard);
    $('#timeResult').html(currentBoardResults.averageInputTime);
    $('#missedResult').html(currentBoardResults.missCount);
    $('#wrongResult').html(currentBoardResults.wrongInputCount);
    $('#correctResult').html(currentBoardResults.score);

    $('#resBox').show();
    errTimeout = setTimeout(function () {
        $('#resBox').hide();
    }, 10000);
}

function setMultiplayerBoardResults() {
    let winner;
    if (multiplayerBoardResults.score > currentBoardResults.score) {
        $('#multiWinnerVal').html(multiplayerBoard + " won!");
    } else if (multiplayerBoardResults.score < currentBoardResults.score) {
        $('#multiWinnerVal').html(currentBoard + " won!");
    } else {
        $('#multiWinnerVal').html("It was a tie!");
    }
    $('#player2Name').html(multiplayerBoard);

    $('#player2Name').html(multiplayerBoard);
    $('#timeResultMulti').html(multiplayerBoardResults.averageInputTime);
    $('#missedResultMulti').html(multiplayerBoardResults.missCount);
    $('#wrongResultMulti').html(multiplayerBoardResults.wrongInputCount);
    $('#correctResultMulti').html(multiplayerBoardResults.score);

    $('#resBoxMulti').show();
    $('#multiWinnerVal').show();
    errTimeout = setTimeout(function () {
        $('#resBoxMulti').hide();
        $('#multiWinnerVal').hide();
    }, 10000);
}

function selectMultiplayerBoard(boardName) {
    if (boardName == "none") {
        multiplayerBoard = "none";
        $("#currentMultiplayerBoard").text("None");
    } else {
        multiplayerBoard = boardName;
        $("#currentMultiplayerBoard").text(boardData[boardName].ownerName);
    }
}

function selectBoard(boardName) {
    if (currentBoard != "none") {
        $("#multiBoard" + currentBoard).show();
    }
    if (boardName == multiplayerBoard) {
        selectMultiplayerBoard("none");
    }
    $("#multiBoard" + boardName).hide();

    currentBoard = boardName;

    $("#currentBoard").text(boardData[boardName].ownerName);
    $("#timeToAnswer").val(boardData[boardName].timeToAnswer);
    $("#lives").val(boardData[boardName].lives);
    $("#currentTimeToAnswer").text(boardData[boardName].timeToAnswer);
    $("#currentLives").text(boardData[boardName].lives);

    $('#joystick_up').attr('checked', false);
    $('#joystick_down').attr('checked', false);
    $('#joystick_left').attr('checked', false);
    $('#joystick_right').attr('checked', false);
    $('#joystick_center').attr('checked', false);
    $('#accelerometer_tilt_left').attr('checked', false);
    $('#accelerometer_tilt_right').attr('checked', false);
    $('#accelerometer_pitch_up').attr('checked', false);
    $('#accelerometer_pitch_down').attr('checked', false);
    $('#potentiometer').attr('checked', false);
    $('#button_squence').attr('checked', false);

    if (boardData[currentBoard].blacklist) {
        console.log(boardData[currentBoard].blacklist)
        for (var i = 0; i < boardData[currentBoard].blacklist.length; i++) {
            if (boardData[currentBoard].blacklist[i] == "JOYSTICK_UP") {
                $('#joystick_up').attr('checked', true);
            }
            if (boardData[currentBoard].blacklist[i] == "JOYSTICK_DOWN") {
                $('#joystick_down').attr('checked', true);
            }
            if (boardData[currentBoard].blacklist[i] == "JOYSTICK_LEFT") {
                $('#joystick_left').attr('checked', true);
            }
            if (boardData[currentBoard].blacklist[i] == "JOYSTICK_RIGHT") {
                $('#joystick_right').attr('checked', true);
            }
            if (boardData[currentBoard].blacklist[i] == "JOYSTICK_CENTER") {
                $('#joystick_center').attr('checked', true);
            }
            if (boardData[currentBoard].blacklist[i] == "ACCELEROMETER_TILT_LEFT") {
                $('#accelerometer_tilt_left').attr('checked', true);
            }
            if (boardData[currentBoard].blacklist[i] == "ACCELEROMETER_TILT_RIGHT") {
                $('#accelerometer_tilt_right').attr('checked', true);
            }
            if (boardData[currentBoard].blacklist[i] == "ACCELEROMETER_PITCH_UP") {
                $('#accelerometer_pitch_up').attr('checked', true);
            }
            if (boardData[currentBoard].blacklist[i] == "ACCELEROMETER_PITCH_DOWN") {
                $('#accelerometer_pitch_down').attr('checked', true);
            }
            if (boardData[currentBoard].blacklist[i] == "POTENTIOMETER_TURN") {
                $('#potentiometer').attr('checked', true);
            }
            if (boardData[currentBoard].blacklist[i] == "BUTTON_SEQUENCE") {
                $('#button_squence').attr('checked', true);
            }
        }
    }

    $("#multiplayer-btn").show();

    $("#boardForm").show();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}