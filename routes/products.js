var express = require("express");
var router  = express.Router();
var products = require("../models/products");
var middleware = require("../middleware");

router.get("/", function(req,res){
	
	
	products.find({}, function(err,prod){
		if(err){
			console.log(err);
		}else{
			res.render("products/index", {product: prod, currentUser: req.user});
		}
	});	
	// res.render("products", {product: product});
});
router.post("/",middleware.isLoggedIn,function(req,res){
	var name= req.body.name;
	var image= req.body.image;
	var description = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newObject={name: name, price: price ,image: image,description:description, author: author};
	products.create(newObject,function(err,prod){
		if(err){
			console.log(err);
		}else{
			res.redirect("/index");
		}
	})
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("products/new");
});
router.get("/:id", function(req,res){
	//detect the id and get the product
	products.findById(req.params.id).populate("comments").exec(function(err, foundId){
		if(err){
			console.log(err);
		} else {		
			console.log(foundId);
			res.render("products/show",{products: foundId});
		}
	});
	//render show template	
});
//EDIT PRODUCT ROUTE
router.get("/:id/edit", middleware.checkProductOwnership, function(req,res){
		products.findById(req.params.id, function(err, foundId){
			if(!err){
			res.render("products/edit",{products: foundId});
		}});
});


//UPDATE
router.put("/:id", middleware.checkProductOwnership,  function(req,res){

	products.findByIdAndUpdate(req.params.id, req.body.products, function(err, updated){
		if(err){
			res.redirect("/index");
		}else{
			res.redirect("/index/" + req.params.id);
		}
	})
});
//DESTROYYYY
router.delete("/:id", middleware.checkProductOwnership,  function(req,res){
	products.findByIdAndRemove(req.params.id, function(err,foundId){
		if(err){
			res.redirect("/index");
		}else{
			
			res.redirect("/index");
		}
	})
});

module.exports= router;