var CampGround  = require("../models/campground");
var Comment     = require("../models/Comment");

var middlewareObj= {};

// Campground Posts OwnerShip middleware
middlewareObj.isOwner = function( req, res ,next){
    if(req.isAuthenticated()){
        CampGround.findById(req.params.id , function(err, foundCampground){
            if (err){
                console.log(err);
                req.flash("error", "Campground Not Found")
                res.redirect("/campgrounds");
            }else{
                // is user the owner ?
                if (foundCampground.author.id.equals(req.user._id)){
                    next()
                }else{
                    req.flash("error", "You Don't Have Permission To Do That !")
                    res.redirect("back") ;
                }
            }
        });
    }else{
        res.flash("error" ,"You Need To Be Logged In To Do That!! " )
        res.redirect("back");
    }
}

//// comments OwnerShip middleware
middlewareObj.isCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id , function(err, foundComment){
            if (err){
                res.redirect("back");
            }else{
                // is user the owner of the comment ?
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.flash("error" ,"You Don't Have Permission To Do That!! " )
                    res.redirect("back") ;
                }
            }
        });
    }else{
        res.flash("error" ,"You Need To Be Logged In To Do That!! " )
        res.redirect("back");
    }
}

// logged in middleware
middlewareObj.isLoggedin = function(req,res,next){
    if(req.isAuthenticated()){
        return next(); 
    }
    req.flash("error", " You Need To Be Logged In To Do That!!");
    res.redirect("/login");
}

module.exports= middlewareObj