var express    = require("express"),
	app        = express(),
	BodyParser = require("body-parser"),
	mongoose   = require("mongoose"),
	flash      = require("connect-flash"),
	passport   = require("passport"),
	LocalStrategy = require("passport-local"),
	products   = require("./models/products"),
	Comment	   = require("./models/comment"),
	User	   = require("./models/user"),
	methodOverride= require("method-override"),
	seedDB     = require("./seeds");

//REFACTORING ROUTES
var commentRoutes = require("./routes/comments"),
 productsRoutes = require("./routes/products"),
 indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/mood_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(BodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();
//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Nandu",
	resave: false,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser= req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
app.use("/index/:id/comments", commentRoutes);
app.use("/index", productsRoutes);
app.use(indexRoutes);



app.listen(3000, function(req,res){
	console.log("Connected");
});