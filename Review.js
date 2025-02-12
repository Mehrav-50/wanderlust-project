const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    comment : String,
    rating :{
        type : Number,
        min : 1,
        max : 5,
        
    },
    Created_At : {
        type : Date,
        default : Date.now()
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User', 
        required : true
     },
    
});
module.exports =  mongoose.model('Review', reviewSchema);