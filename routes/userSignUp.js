const express = require('express');
const router = express.Router();
const User  = require("../userModel.js");
const passport = require("passport"); 
const userBody = require("../controllers/user.js");
function asyncWrap(fn){
    return function (req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}
router.route("/signup").
get( (req,res)=>{
    res.render("signup.ejs")
})
.post( asyncWrap(userBody.signupPost));
router.route("/login").
get((req,res)=>{
    res.render("login.ejs")
})
.post( passport.authenticate("local" , 
    {failureRedirect : "/login" , failureFlash : true}),  userBody.loginPost);
router.get("/logout",userBody.logout);
router
module.exports = router;