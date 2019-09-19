var express        = require("express"),
    app            = express(),
    bodyparser     = require("body-parser"),
    mongoose       = require("mongoose"),
    CampGround     = require("./models/campground"),
    Comment        = require("./models/comment"),
    flash          = require("connect-flash")
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    User           = require("./models/user"),
    seedDB         = require("./seeds");
    

// REQUIRING ROUTES
var commentsRoutes = require("./routes/comment"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});

app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static( __dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIG

app.use(require("express-session")({
    secret: " kill me now",
    resave:false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// add the user component to all templates
app.use(function(req, res,next ){
    res.locals.currentUser= req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(3000,function(){
    console.log(" The YelpCamp Server is UP !! ");
});