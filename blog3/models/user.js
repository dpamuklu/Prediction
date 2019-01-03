var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username : { type: String, require: true, index:true, sparse:true},
    password : { type: String, require: true },
});

userSchema.plugin(passportLocalMongoose );

module.exports = mongoose.model("User", userSchema);
