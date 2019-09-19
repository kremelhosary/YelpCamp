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

//mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});

mongoose.connect("mongodb+srv://kremkamal:Highspeedlowdrag@22@cluster0-in4r6.mongodb.net/test?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useCreateIndex: true
    }).then(()=> {
        console.log('connected to db');
    }).catch(err => {
        console.log(err.message);
    });

// mongodb+srv://<kremkmal>:<Highspeedlowdrag@22>@cluster0-in4r6.mongodb.net/test?retryWrites=true&w=majority

mongoose.set('useFindAndModify', false);

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

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Our app is running on port ${ PORT }`);
// });

// var port = process.env.PORT || 3000;
// app.listen(port, function () {
//   console.log("Server Has Started!");
// });

app.listen(3000,function(){
    console.log(" The YelpCamp Server is UP !! ");
});