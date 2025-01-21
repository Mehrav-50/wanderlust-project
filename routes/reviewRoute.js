const express = require("express");
const router = express.Router({mergeParams : true});
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const Review = require("../Review.js");
const Listing = require("../model.js");
const reviewBody = require("../controllers/reviews.js");
router.delete("/:reviewId", asyncWrap(reviewBody.deleteReview));
const reviewListing = (req,res,next)=>{
    let {errors} = reviewSchema.validate(req.body);
    if(errors){
        let errMsg = errors.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
        }
        else{
        next();
}}
router.post("/",reviewListing, asyncWrap(reviewBody.postReview));
function asyncWrap(fn){
    return function (req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}
module.exports = router;