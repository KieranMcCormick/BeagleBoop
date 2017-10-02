var DOSAGEPUTURL = "https://lumohacks-med-disp.firebaseio.com/patients/197214/dosage.json";
var ALERTPUT = "https://lumohacks-med-disp.firebaseio.com/patients/197214/alert.json";
var DOSAGEPERDAYURL = "https://lumohacks-med-disp.firebaseio.com/patients/197214/dosesPerDay.json"

var PATIENTSURL = "https://lumohacks-med-disp.firebaseio.com/patients.json"
var NEXTDISPENSEURL = "https://lumohacks-med-disp.firebaseio.com/patients/197214/nextDispense.json"



$(document).ready(function () {

    $.get({
        url: NEXTDISPENSEURL
    })
        .done(function (data) {
            console.log("Dispense Data: ", data);
            console.log("Current time ", Date.now());
            var timeDifference = (Date.now() / 1000) - data;
            // Next dispense time
            console.log("Time difference ", timeDifference);
        })
    $('#tabs').tabs();
});