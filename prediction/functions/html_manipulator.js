document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("date").innerHTML = modify_actual_time();

});

window.onload = refresh_page();

function refresh_page() {
  setTimeout(function () {
      location.reload()
  }, 10000);
};

function modify_actual_time(){

  var date = new Date();
  return date.toGMTString();
}

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

function add_games(result) {

    // subtract two hours from the actual time to check status
    var addedTime = new Date();
    var isodate = addedTime.toISOString();

    addedTime.setHours(addedTime.getHours() - 2);
    var isoAddedTime = addedTime.toISOString();
    var tableContent = "";

    const status_not_started = "Not Started",
          status_pending     = "Pending",
          status_finished    = "Finished";

    result.prediction.forEach(function(prediction){

      // <!-- sort by date -->
      prediction.body.data.sort(function(a, b) {
           return (a.start_date < b.start_date ) ? -1 : ((a.start_date > b.start_date) ? 1 : 0);
      });

      prediction.body.data.forEach(function(detail){

        var odd = detail.odds[detail.prediction];
        var date = detail.start_date.split("T")[1];

        //check bet rates
        if (odd > 1.6 ) {
          var tdOddsOpeningTag = '<td class="text-danger">';
        } else if(odd < 1.6 && odd > 1.30) {
          tdOddsOpeningTag = '<td class="text-primary">';
        } else {
          tdOddsOpeningTag = '<td>';
        }

        // add color to game time
        if (isodate > detail.start_date ) {
          var tdTimeOpeningTag = '<td class="text-danger">';
        } else {
          tdTimeOpeningTag = '<td>';
        };

        // check status
        if (isodate > detail.start_date && detail.start_date > isoAddedTime ) {
          var status = status_pending;
        } else if ( isoAddedTime >  detail.start_date ) {
          status = status_finished;
        } else {
          status = status_not_started;
        }

        tableContent += "<tr>";
        tableContent += "<td>" + detail.home_team  + "</td>";
        tableContent += "<td>" + detail.away_team  + "</td>";
        tableContent += "<td>" + detail.prediction + "</td>";
        tableContent += tdOddsOpeningTag + odd  + "</td>";
        tableContent += "<td>" + date + "</td>";
        tableContent += tdTimeOpeningTag  + status + "</td>";
        tableContent += "</tr>";

        document.getElementById("games").innerHTML = tableContent;
    });
  });
};
