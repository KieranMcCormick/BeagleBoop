var DATAURL = "https://beagle-boop.firebaseio.com/boards/";
var BOARDURL = "https://beagle-boop.firebaseio.com/boards.json";
var boardData;
var currentBoard = "none";

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
                $('#myDropdown').append(item);

            }

            console.log("Done.");
        })

    $('#updateButton').click(function () {
        var id = $(this).attr('id');

        var d = new Date();
        var currentUnixTime = d.getTime();
        for (i in UPDATE_URL_END) {
            console.log("end: " + UPDATE_URL_END[i])
            $.ajax({
                method: "PUT",
                url: DATAURL + currentBoard + "/" + UPDATE_URL_END[i] + ".json",
                data: $("#" + UPDATE_URL_END[i]).val().toString()
            }).done(function (data) {
                console.log(UPDATE_URL_END[i] + ' updated')
            })
        }

        $.ajax({
            method: "PUT",
            url: DATAURL + currentBoard + UPDATEURL_SEED,
            data: currentUnixTime.toString()
        }).done(function (data) {
            console.log('Seed updated')
        })

        $.ajax({
            method: "PUT",
            url: DATAURL + currentBoard + UPDATEURL_ALERT,
            data: "true"
        }).done(function (data) {
            console.log('Alert updated')
        })

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

function selectBoard(boardName) {
    console.log("selectBoard: " + boardName);
    console.log(boardData[boardName].ownerName);
    currentBoard = boardName;
    console.log("currentBoard: " + currentBoard);
    $("#currentBoard").text(boardData[boardName].ownerName);
    $("#timeToAnswer").val(boardData[boardName].timeToAnswer);
    $("#lives").val(boardData[boardName].lives);

    $("#boardForm").show();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}