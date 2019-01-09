var express          = require("express"),
    app              = express(),
    predictionRoutes = require("./routes/prediction");

app.set("view engine", "ejs");
app.use(express.static( __dirname));
app.use(predictionRoutes);

app.listen(process.env.PORT || 3000, function() {
    console.log("SERVER IS RUNNING!");
});
