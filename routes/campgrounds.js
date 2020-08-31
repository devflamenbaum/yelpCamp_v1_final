var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", (req,res)=>{
	// Get all campgrounds in the DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

router.post("/", middleware.isLoggedIn, (req,res)=>{
	//get Data from form and add to campground DB
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image:image, price: price, description: desc, author: author}
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to app.get("/campground") route
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	})
});

router.get("/new", middleware.isLoggedIn, (req,res)=>{
	res.render("campgrounds/new.ejs");
});

router.get("/:id", (req, res)=>{
	//find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//console.log(foundCampground);
			res.render("campgrounds/show.ejs", {campground: foundCampground});
		}
	});
});

//Edit campground Route

router.get("/:id/edit", middleware.checkCampgroundOwnership, (req,res)=>{
		Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit.ejs", {campground: foundCampground});	
	});
});

//Update campground Route

router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds")
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})
//Destroy campground Route

router.delete("/:id", middleware.checkCampgroundOwnership, async(req,res) =>{
	try{
		let foundCampground = await Campground.findById(req.params.id);
		await foundCampground.deleteOne();
    	res.redirect("/campgrounds");
	}catch (error) {
    	console.log(error.message);
    	res.redirect("/campgrounds");
  }
})


module.exports = router;