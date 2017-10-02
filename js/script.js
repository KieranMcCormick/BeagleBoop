var DATAURL = "https://beagle-boop.firebaseio.com/boards/938172/data.json"
var BOARDURL = "https://beagle-boop.firebaseio.com/boards.json"

$(document).ready(function () {


    $.get({
        url: BOARDURL
    })
        .done(function (data) {
            console.log("Data: ", data);

            var js = 1
            for (i in data) {


                console.log(data[i])


            }

            console.log("Done.");
        })

    /*     $.get({
            url: DATAURL
        })
            .done(function (data) {
                console.log("Data: ", data);
                console.log("Current time ", Date.now());
                console.log("Done.");
            }) */
});