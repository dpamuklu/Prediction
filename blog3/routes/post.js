var express       = require("express"),
	router        = express.Router(),
	Post          = require("../models/post"),
	User 	      = require("../models/user"),
	middleware    = require("../middleware");

router.get("/posts", (req, res) => {
	Post.find({}, function(err, blogs){
		if(err){
			console.log("ERROR");
		} else {
			res.render("index", { blogs: blogs, currentUser : req.user } );
		}
	});	
});

router.get("/posts/new", middleware.isLoggedIn, (req, res) => {
	res.render("new");
});

router.post("/posts", function(req, res){
	
	Post.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			res.redirect("/");
		}
	});
});

router.get("/posts/:id", function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(err){
            res.render("404");
        } else {
            res.render("post", { post: post });    
        }
    });
});

router.get("/posts/:id/edit", function(req, res){
	
	Post.findById(req.params.id, function(err, post){
		if(err){
			res.render("404");
		} else {
			res.render("edit", { post: post, currentUser : req.user });
		}
	});
});

router.put("/posts/:id", function(req,res){
	
	Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post){
		if(err){
			// handle error
		} else {
			res.redirect("/posts/" + req.params.id);
		}
	});
});

router.delete("/posts/:id", function(req, res){
	Post.findByIdAndDelete(req.params.id, req.body.post, function(err, post){
		if(err){
			// handle error
		} else {
			res.redirect("/");
		}
	});
});

router.get("*", (req, res) => {
	res.render("404");
});

module.exports = router;
