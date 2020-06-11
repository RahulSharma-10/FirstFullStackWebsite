var express = require("express");
var router  = express.Router();
var passport= require("passport");
var User=    require("../models/user");

router.get("/", function(req,res){
	res.render("landing");
})
// ==================
//AUTH ROUTES
// =========
router.get("/register",function(req,res){
	res.render("register");
});
//ROUTE FOR SIGNUP LOGIC
router.post("/register",function(req,res){
	var newUser= (new User({username: req.body.username}));
	User.register(newUser, req.body.password,function(err,user){
		if(err){
			req.flash("error", err.message);
			console.log(err);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res, function(){
			req.flash("success", "Welcome to MoodBoard " + user.username);
			res.redirect("/index");
		})
	});
	
});
//show login form
router.get("/login",function(req,res){
	res.render("login");
});
//ROUTE FOR LOGIN LOGIC
router.post("/login",passport.authenticate("local",
	{successRedirect:"/index", 
	 failureRedirect:"/login"}), function(req,res){
	if(res.redirect("/index")){
		req.flash("success","Welcome to MoodBoard" + user.username);
	}else if(res.redirect("/login")){
		req.flash("error","Password is Incorrect");
	}
});
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "You have been successfully logged out");
	res.redirect("/index");
});
//MIDDLEWARE


module.exports= router;