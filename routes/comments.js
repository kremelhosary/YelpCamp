var express = require("express");
var router = express.Router({ mergeParams: true });
var CampGround = require("../models/campground");
var Comment    = require("../models/Comment");
var middleware = require("../middleware")

//   New Route
router.get("/new" ,middleware.isLoggedin ,function(req, res ){
    CampGround.findById(req.params.id , function(err, campground){
        if (err){
            console.log(err);
        }else{
            res.render("comments/new" , {campground: campground});
        }
    });
});

//   Create Route
router.post("/", middleware.isLoggedin, function(req , res){
    CampGround.findById(req.params.id , function(err , campground){
        if  (err){
            console.log(err);
            res.redirect("/campgrounds");
        }else {
            Comment.create(req.body.comments , function(err , comment){
                if (err){
                    console.log(err);
                }else{
                    // add a user and an id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save the comment
                    comment.save();                    
                    campground.comments.push(comment);
                    // save the comment to the camp and add them both to the db
                    campground.save();
                    req.flash("success", "Comment Added")
                    res.redirect("/campgrounds/"+ campground._id);
                }
            });
        }
    });
});

// Edit Route
router.get("/:comment_id/edit" ,middleware.isCommentOwner, function( req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment ){
      if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
        }
    });
});

// Update Route
router.put("/:comment_id" ,middleware.isCommentOwner, function( req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment , function(err, upComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id );
        }
    })
})

// Delete Route
router.delete("/:comment_id",middleware.isCommentOwner ,function(req , res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment Removed");
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});


module.exports = router;