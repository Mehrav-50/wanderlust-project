const joi = require('joi');

module.exports.listingSchema = joi.object({
       listing : joi.object({ title: joi.string().required(),
        description : joi.string().required(),
        image : joi.string().allow("",null),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        country: joi.string().required()
    
       }).required(),
})
module.exports.reviewSchema = joi.object({
       review : joi.object({
              Comment : joi.string().required(),
              Rating : joi.number().required().min(1).max(5),
              Created_At : joi.date().required(),
       }).required(),
})
