var express = require("express");
var router = express.Router();
var CampGround = require("../models/campground");
var middleware = require("../middleware")

// INDEX ROUTE
router.get("/",function(req,res){
    // get all camps from db
    CampGround.find({},function(err,AllCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index" , {camplist: AllCampgrounds});
        };   
    });
});

// CREATE ROUTE
router.post("/", middleware.isLoggedin ,function(req,res){
    var name = req.body.name;
    var image= req.body.image;
    var price= req.body.price;
    var description = req.body.desc;
    var author ={
        id: req.user._id,
        username : req.user.username
    }
    var newcamp = { name: name , image: image, desc: description, author: author, price: price };

    CampGround.create(newcamp,function(err,campground){
        if(err){
            console.log("errrrr");
            console.log(err);
        }else{
            console.log(campground);

            res.redirect("/campgrounds");
        };
    });
});


// NEW - route
router.get("/new",middleware.isLoggedin ,function(req,res){
    res.render("campgrounds/new");
});


//SHOW  -  show more info aka description
router.get("/:id", function( req, res){
    CampGround.findById(req.params.id).populate("comments").exec(function(err,foundCampGround){
        if (err){
            console.log(err);
        }else{
            res.render("campgrounds/show" ,{ campground: foundCampGround });
        }
    });
});

/// EDIT ROUTE
router.get("/:id/edit" ,middleware.isOwner, function(req, res ){
    CampGround.findById(req.params.id , function(err, foundCampground){        
        res.render("campgrounds/edit" , {campground:foundCampground});
    });
});

/// UPDATE ROUTE
router.put("/:id" ,middleware.isOwner, function(req, res ){
    CampGround.findByIdAndUpdate(req.params.id , req.body.campground, function(err, Updated){
        if (err){
            res.render("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+ req.params.id );
        }
    });
});

router.delete("/:id" ,middleware.isOwner, function(req, res ){
    CampGround.findByIdAndDelete(req.params.id, function(err){
        if (err){
            res.redirect("/campgrounds");
        }
        res.redirect("/campgrounds");
    })
})


module.exports = router ;