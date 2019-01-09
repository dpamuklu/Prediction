var mongoose = require("mongoose");

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

module.exports = { predictionSchema:       mongoose.model("predictionStats",  predictionSchema) ,
                   predictionDetailSchema: mongoose.model("predictionDetailStats", predictionDetailSchema)
                 }
