var DATAURL = "https://beagle-boop.firebaseio.com/boards/938172/data.json"
var BOARDURL = "https://beagle-boop.firebaseio.com/boards.json"

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

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

function selectBoard(data) {
    console.log("test: " + data);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

$(document).ready(function () {


    $.get({
        url: BOARDURL
    })
        .done(function (data) {
            console.log("Data: ", data);

            var js = 1
            for (i in data) {

                console.log(data[i])
                var item = $('#hiddenLink').clone();
                item.attr("id", "boardItem")
                item.attr("onclick", 'selectBoard("' + i + '")');
                item.text(capitalizeFirstLetter(i));
                $('#myDropdown').append(item);

            }

            console.log("Done.");
        })

    $('#btn').click(function () {
        var id = $(this).attr('id');
        alert(id);
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