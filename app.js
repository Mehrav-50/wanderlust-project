if(process.env.NODE_ENV !== 'production'){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 3000;
const ExpressError = require("./utils/expressError.js");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.urlencoded({extended : true}));
const listings = require("./routes/listingRoute.js");
const reviews = require("./routes/reviewRoute.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash =  require("connect-flash");
const passport = require("passport");
const localPassport = require("passport-local");
const User = require("./userModel.js");
const userSignUp = require("./routes/userSignUp.js");
const dbUrl = process.env.ATLAS_DB_VALUE;
async function main(){
    await mongoose.connect(dbUrl);
}
main().then((res)=>{
    console.log("connection successful")
})
.catch((err)=>{
    console.log("err in connection" , err.message);
})
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto :  {
        secret : process.env.SECRET
    },
    touchAfter : 24 * 3600
});
store.on("error",()=>{
    console.log("error occured");
})
const sessionOptions = {
    store : store,
    secret : process.env.SECRET,
    resave : "false", 
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(path.join(__dirname,"/public")));
app.set("view engine","ejs");
app.set("link", "img src");
app.listen(port,()=>{
    console.log("Listening on port", port);
});
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
   res.locals.redirectUrl = req.session.redirectUrl
    next();
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/" , userSignUp);

app.all("*", asyncWrap(async(req,res,next)=>{
    next(new ExpressError(404, "Page not found"))
}))
app.use((err,req,res,next)=>{
    let{status = 500 , message} = err;
    res.status(status).render("error.ejs", {message,err});
    
})

function asyncWrap(fn){
    return function (req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}