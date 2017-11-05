var DATAURL = "https://beagle-boop.firebaseio.com/boards/938172/data.json"
var BOARDURL = "https://beagle-boop.firebaseio.com/boards.json"
var boardData;


$(document).ready(function () {


    $.get({
        url: BOARDURL
    })
        .done(function (data) {
            boardData = data;
            console.log("Data: ", boardData);

            var js = 1
            for (board in boardData) {

                console.log(boardData[board])
                var item = $('#hiddenLink').clone();
                item.attr("id", "boardItem")
                item.attr("onclick", 'selectBoard("' + board + '")');
                item.text(capitalizeFirstLetter(board));
                $('#myDropdown').append(item);

            }

            console.log("Done.");
        })

    $('#btn').click(function () {
        var id = $(this).attr('id');
        alert("test");
    });

    /*     $.get({
            url: DATAURL
        })
            .done(function (data) {
                console.log("Data: ", data);
                console.log("Current time ", Date.now());
                console.log("Done.");
            }) */
});

//TODO 
// function updateData() {
//         //TODO: get data from firebase and update UI
//     });
// }
// timeInterval = setInterval(updateData, 1000);

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function selectBoard(boardName) {
    console.log("selectBoard: " + boardName);
    console.log(boardData[boardName].ownerName);
    $("#currentBoard").text(boardData[boardName].ownerName);
    $("#timeInput").val(boardData[boardName].timeToAnswer);
    $("#lives").val(boardData[boardName].lives);

    $("#boardForm").show();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}