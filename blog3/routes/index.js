var express    = require("express"),
	router     = express.Router(),
	User 	   = require("../models/user"),
	passport   = require("passport"),
	middleware = require("../middleware");

router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", function(req, res){
	
	var newUser = new User( {username: req.body.username } );
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			res.render("register");
		}
		passport.authenticate('local')(req, res, function(){
		    res.redirect("/admin");
		});
	});
});

router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", passport.authenticate('local',  {
		successRedirect : "/",
		failureRedirect : "/login"
}), function(req, res){
});

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

router.get("/admin", middleware.isLoggedIn, (req,res) => {
	res.render("admin");
});

router.get("/", (req,res) => {
	res.redirect("/posts");
});

module.exports = router;