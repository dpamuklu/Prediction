var bodyParser 	     = require("body-parser"),
	methodOverride   = require("method-override"),
	mongoose         = require("mongoose"),
	passport		 = require("passport"),
	express        	 = require("express"),
//    expressSanitizer = require("express-sanitizer"),
	User			 = require("./models/user"),
	localStrategy    = require("passport-local"),
	passportLocalMng = require("passport-local-mongoose"),
	expressValidator = require("express-validator");
	app		       	 = express();			
	
var indexRoutes = require("./routes/index"),
    postRoutes  = require("./routes/post");
	
// App.Config	
mongoose.connect("mongodb://localhost/blog-db", { useCreateIndex: true, useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
//app.use(expressSanitizer());
app.use(require("express-session")({
	secret 		      : "vidanjor is my dog",
	resave 			  : false,
	saveUninitialized : false 
}));
app.use(expressValidator());

app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new localStrategy( User.authenticate() )) ;  
  
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);
app.use(postRoutes);

app.listen(3000, function(){
	console.log("SERVER IS RUNNING!");
});