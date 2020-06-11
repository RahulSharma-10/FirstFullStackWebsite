var express = require("express");
var router  = express.Router({mergeParams: true});
var products = require("../models/products");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// =========================
// COMMENT NEW
router.get("/new", middleware.isLoggedIn, function(req,res){
	products.findById(req.params.id, function(err, found){
	if(err){
		console.log(err);
	}else{
		console.log(found);
		res.render("comments/new", {product: found});	
	}
	});
});
// COMMENT SAVE
router.post("/", middleware.isLoggedIn, function(req,res){
	products.findById(req.params.id, function(err, foundc){
	if(err){
		console.log(err);
	}else{
		Comment.create(req.body.comments, function(err, comment){
			if(err){
				console.log(err);
			}else{
				comment.author.id= req.user._id;
				comment.author.username=req.user.username;
				comment.save();
				console.log(comment);
				foundc.comments.push(comment);
				foundc.save();
				req.flash("success","Successfully Created Comment");  
				res.redirect("/index/" + foundc._id );
			}
		})
	
	}
	});
});
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
		
		res.render("comments/edit", {products_id: req.params.id, comments: foundComment});	
		}
	});
});
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, function(err, updated){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Successfully Updated Comment");  
			res.redirect("/index/" + req.params.id);
		}
	});
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/index/" + req.params.id);
		}
	});
});

module.exports= router;
