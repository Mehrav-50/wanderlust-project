const mongoose = require("mongoose");
const Review = require("./Review.js");
let newSchema =new mongoose.Schema({
    title :{
        type : String,
        required: true
    },
    description :{
        type : String,
        required: true
    },
    image :{
        url : String,
        filename : String,
        
    },
    price : {
        type : Number,
        min : 0,
        required: true
    },
    location :{
        type :String,
        required: true
    },
    country :{
        type : String,
        required: true
    },
    reviews :[{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Review"
    },
],
    owner : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User', 
    required : true
     },
});
newSchema.post("findOneAndDelete" , async(listing)=>{
    if(listing){
        await Review.deleteMany({id : {$in : listing.reviews}})
    }
});
const Listing = mongoose.model("Listing",newSchema);
module.exports = Listing;