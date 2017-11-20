var DATAURL = "https://beagle-boop.firebaseio.com/boards/";
var BOARDURL = "https://beagle-boop.firebaseio.com/boards.json";
var boardData;
var currentBoard = "none";
var multiplayerBoard = "none"

var UPDATEURL_START = "https://beagle-boop.firebaseio.com/boards/";
var UPDATEURL_ALERT = "/alert.json";
var UPDATEURL_SEED = "/seed.json";

var UPDATEURL_LIVES = "lives";
var UPDATEURL_TIMETOANSWER = "timeToAnswer";

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
        timeInterval = setInterval(updateUI, 1000);
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

    $("#multiplayer-btn").show();

    $("#boardForm").show();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}