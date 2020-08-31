// all the middlewares goes here

var Campground = require("../models/campground");
var Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req,res,next) =>{
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash("error", "Campgorund not found!");
			res.redirect("back")
		} else{
			if(foundCampground.author.id.equals(req.user._id)){
				next();
			}else{
				req.flash("error", "You don't have the permission to do that!");
				res.redirect("back")
			}
		}
	})
	}else{
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = (req,res,next) =>{
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			req.flash("error", "Something went wrong!");
			res.redirect("back")
		} else{
			if(foundComment.author.id.equals(req.user._id)){
				next();
			}else{
				req.flash("error", "You need to be logged in to do that!");
				res.redirect("back")
			}
		}
	})
	}else{
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = (req,res,next) =>{
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}

module.exports = middlewareObj;
