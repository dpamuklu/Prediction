var unirest  = require('unirest'),
    mongoose = require("mongoose"),
    express  = require("express"),
    app      = express(),
    mongodb  = require("mongodb"),
    key      = require("./config_key.js");

var a,
    b,
    result = { prediction:"", predictionDetails:"" };

const predict_date = "2019-01-03";

console.log();

predictionSchema = new mongoose.Schema({
    status:      Object,
    header:      Object,
    body:        Object,
    predictDate: String,
});

predictionDetailSchema = new mongoose.Schema({
    status:      Object,
    header:      Object,
    body:        Object,
    predictDate: String,
});

predictionStats       = mongoose.model("predictionStats",       predictionSchema);
predictionDetailStats = mongoose.model("predictionDetailStats", predictionDetailSchema);

// update();
getprediction()
// setInterval(update, 1500);

async function update() {

 await connect_db();

 result.prediction = await get_prediction_stats(predict_date);

 if ( result.prediction.length === 0 ) {

   const response = await get_api_response(predict_date);

   await save_response_db(response, predict_date)

   result.prediction = await get_prediction_stats(predict_date);
 }

  display_games(result);

};

async function getprediction() {

  await connect_db();

  result.prediction        = await get_prediction_stats(predict_date);
  result.predictionDetails = await get_prediction_detail_stats(predict_date);

  display_games(result);

};

function display_games(games){

  games.prediction.forEach(function(prediction){

    if (prediction.predictDate === predict_date) {

      prediction.body.data.forEach(function(detail){
        console.log(detail.home_team, detail.away_team, detail.prediction, detail.odds[detail.prediction], detail.start_date );
      });
    }
  });
};

async function get_api_response(iso_date){

    return new Promise ((resolve, reject) => {

    prediction_url = "https://football-prediction-api.p.rapidapi.com/api/v2/predictions?iso_date=" + iso_date;

    unirest.get(prediction_url)
        .header("X-RapidAPI-Key", key.x_rapid_api_key)
        .end(function(result) {
            resolve(result);
        });
    });
};

async function save_response_db(data, predict_date){

  var prediction = await new predictionStats({
      status: data.status,
      header: data.headers,
      body:   data.body,
      predictDate: predict_date,
  });

  return new Promise(function(resolve, reject){
      prediction.save( function(err) {
      if (err) {
         resolve(console.log(err));
      } else{
         resolve(console.log("Data yenilendi!"));
      };
    })
  });
};

async function connect_db(){

  await mongoose.connect("mongodb://localhost/prediction", {
      useCreateIndex: true,
      useNewUrlParser: true
  });
};

async function get_prediction_stats(predict_date){

    const localresult = await mongoose.connection.collection("predictionstats").find( { status:200, predictDate: predict_date } ).toArray();
    return await localresult;
};

function get_prediction_detail_stats(predict_date){

    const localresult =  mongoose.connection.collection("predictiondetailstats").find({ status:200, predictDate: predict_date }).toArray();
    return localresult;
};

app.listen(3000, function() {
    console.log("SERVER IS RUNNING!");
});
