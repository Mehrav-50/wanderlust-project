const Review = require("../Review.js");
const Listing = require("../model.js");

module.exports.deleteReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!req.isAuthenticated()){
        req.flash('error',"You must be logged in");
        res.redirect(`/login`);
    }
    if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash('error',"You can not delete any review");
     return res.redirect(`/listings/${id}/show`);
     }
    let List = await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    let deletedReview = await Review.findByIdAndDelete(reviewId);
    console.log(deletedReview);
    res.redirect(`/listings/${id}/show`);
}
module.exports.postReview = async(req,res)=>{
    let {id} = req.params;
    let List = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user;
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be logged in to Access this');
        res.redirect('/login');
    }
    let reviewName =
    List.reviews.push(newReview);
  
    await newReview.save();
     await List.save();
    req.flash('success', 'Review saved successfully');
    res.redirect(`/listings/${id}/show`);
    console.log(List);

}