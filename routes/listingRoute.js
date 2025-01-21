const express = require('express');
const router = express.Router();
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../model.js");
const listingBody = require("../controllers/listing.js");
const {storage} = require("../cloudConfig.js")
const multer = require("multer");
const upload = multer({ storage});
router.get("/:id/edit",   asyncWrap(listingBody.edit
))
const validateListing = (req,res,next)=>{
    let {errors} = listingSchema.validate(req.body);
    if(errors){
        let errMsg = errors.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
        }
        else{
        next();
}}
router.route("/").
post(upload.single("listing[image]"),validateListing  , asyncWrap(listingBody.post))
.get(asyncWrap(listingBody.allListings));

router.route("/:id/show")
.get(asyncWrap(listingBody.show))
.delete( asyncWrap(listingBody.delete));


router.get("/new", asyncWrap(listingBody.new));

router.put("/:id",upload.single("listing[image]"), asyncWrap(listingBody.update));

function asyncWrap(fn){
    return function (req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}
module.exports = router;