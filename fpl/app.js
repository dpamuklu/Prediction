var express = require('express'),
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
    app = express(),
    request = require("request");
	
	usd_price_tl = 1;

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.redirect("standings");
});

app.get("/standings", (req, res) => {

    request({
        url: 'https://api.exchangeratesapi.io/latest?base=USD',
        json: true
    }, function(error, response, body) {
        if (!error) {
            usd_price_tl = body.rates.TRY;
        };
    });

    request({
        url: 'https://fantasy.premierleague.com/drf/leagues-h2h-standings/342211',
        json: true
    }, function(error, response, body) {

        if (!error && response.statusCode === 200) {
            var teams = body.standings.results,
                league_name = body.league.name;
            total_prize_usd = 225.03;

            teams.forEach(function(team, index) {
                if (index == 0) {
                    team.prize_usd = total_prize_usd * (1 / 2)
                } else if (index == 1) {
                    team.prize_usd = total_prize_usd * (1 / 4)
                } else if (index == 2) {
                    team.prize_usd = total_prize_usd * (12.5 / 100)
                } else if (index == 3) {
                    team.prize_usd = total_prize_usd * (8.5 / 100)
                } else if (index == 4) {
                    team.prize_usd = total_prize_usd * (1 / 25)
                };

                if (index <= 4) {
                    team.prize_usd = round(team.prize_usd, 2);
                    team.prize_tl = round(team.prize_usd * usd_price_tl, 2);
                };
            });

            res.render("standings", {
                teams,
                league_name
            });
        }
    });
});

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals).toFixed(decimals);
};

app.listen(3000, function() {
console.log("SERVER IS RUNNING")});