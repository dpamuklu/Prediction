var mongoose     = require("mongoose"),
    unirest      = require("unirest"),
    models       = require("../models/prediction"),
    result       = { prediction:"", predictionDetails:"" };

async function update(res) {

 await connect_db();

 const predict_date = new Date().toJSON().slice(0,10).replace(/-/g,'-');

 result.prediction = await get_prediction_stats(predict_date);

 if ( result.prediction.length === 0 ) {

   const response = await get_api_response(predict_date);

   await save_response_db(response, predict_date)

   result.prediction = await get_prediction_stats(predict_date);
 }

 res.render("index", {result} );

};

async function getprediction(predict_date) {

  await connect_db();

  result.prediction        = await get_prediction_stats(predict_date);
  result.predictionDetails = await get_prediction_detail_stats(predict_date);

};

function display_games(games){

  games.prediction.forEach(function(prediction){

      prediction.body.data.forEach(function(detail){
        console.log(detail.home_team, detail.away_team, detail.prediction, detail.odds[detail.prediction], detail.start_date );
      });

  });
};

async function get_api_response(iso_date){

    return new Promise ((resolve, reject) => {

    prediction_url = "https://football-prediction-api.p.rapidapi.com/api/v2/predictions?iso_date=" + iso_date;

    unirest.get(prediction_url)
        .header("X-RapidAPI-Key", process.env.X_RAPID_API_KEY)
        .end(function(result) {
            resolve(result);
        });
    });
};

async function save_response_db(data, predict_date){

  predictionStats = models.predictionSchema;

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

  await mongoose.connect(process.env.DATABASE_URL, {
      useCreateIndex: true,
      useNewUrlParser: true
  });
};

async function get_prediction_stats(predict_date){

    const localresult = await mongoose.connection.collection("predictionstats").find( { status:200, predictDate: predict_date } ).toArray();
    return localresult;
};

function get_prediction_detail_stats(predict_date){

    const localresult =  mongoose.connection.collection("predictiondetailstats").find({ status:200, predictDate: predict_date }).toArray();
    return localresult;
};

module.exports = { update, getprediction, display_games, get_api_response, save_response_db,
                   connect_db, get_prediction_stats, get_prediction_detail_stats };
