var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

// requiring routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

// mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://azhang:azhang@cluster1-n4psa.mongodb.net/test?retryWrites=true", {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to Database");
}).catch(err => {
    console.log("ERROR: ", err.message);
});


mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the Database

// PASSPORT Config
app.use(require("express-session") ({
    secret: "Ruby is always the cutest!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Calls this func on every route to pass in curr user details through header
app.use(function(req, res ,next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

var PORT = process.env.PORT || 3000;

app.listen(PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started!")
});
