var express = require("express");
var router = express.Router();
var passport= require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

////  INDEX ROOT ROUTE
router.get("/", function(req,res){
    res.render("landing");
});


///   AUTH  REGISTER ROUTE
router.get("/register", function(req,res){
    res.render("register");
});

// Handle REGISTER ROUTE
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser , req.body.password , function(err,user){
        if(err){
            req.flash("error", err.message );
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req , res, function(){
                req.flash("success", "Welcome to YelpCamp "+ user.username + ", Successfully Signed Up")
                res.redirect("/campgrounds");
            });
        }
    });
});

// SHOW LOGIN FORM
router.get("/login", function( req, res){
    res.render("login" )
});

// HANDLE LONGIN LOGIC
router.post("/login", passport.authenticate("local" ,
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function( req, res ){ 
});


// LOGOUT ROUTE
router.get("/logout", function(req, res ){
    req.logOut();
    req.flash("success", "logged out")
    res.redirect("/campgrounds");
});



module.exports = router;

