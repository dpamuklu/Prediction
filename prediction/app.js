var express          = require("express"),
    app              = express(),
    predictionRoutes = require("./routes/prediction"),
    dotenv           = require("dotenv");

// config values
dotenv.config();

app.set("view engine", "ejs");
app.use(express.static( __dirname));
app.use(predictionRoutes);

app.listen(process.env.PORT, function() {
    console.log("SERVER IS RUNNING!");
});
