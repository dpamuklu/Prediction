var express          = require("express"),
    app              = express(),
    predictionRoutes = require("./routes/prediction");

app.set("view engine", "ejs");
app.use(predictionRoutes);

app.listen(3000, function() {
    console.log("SERVER IS RUNNING!");
});
