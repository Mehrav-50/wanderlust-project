const Listing =  require("../model.js")
module.exports.edit = async (req,res,next)=>{
    let {id} = req.params;
    let getList = await Listing.findById(id);
        if(!req.isAuthenticated()){
        console.log(req.originalUrl);
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You must be logged in to Access this');
    res.redirect('/login');
    next();
    } 
    if(!getList.owner._id.equals(res.locals.currUser._id)){
        req.flash('error',"You are not the owner of this listing");
        return res.redirect(`/listings/${id}/show`);
    }
    let originalImageUrl = getList.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/h_200,w_250");
  console.log(originalImageUrl);
    res.render("edit.ejs", {getList, originalImageUrl});
}
module.exports.post = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let newList = new Listing(
       req.body.listing
    )
    newList.save()
    .then((res)=>{
        console.log(res)
    })
    .catch((err)=>{
        console.log(err)
    });
    newList.owner = req.user.id;
    newList.image = {url,filename};
    req.flash("success", "New Listing Added Successfully !!"); 
    

    res.redirect("/listings");
    
}
module.exports.allListings = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings.ejs",{allListings});
}
module.exports.show = async(req,res)=>{
    let{id} = req.params;
    const List = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
    if(!req.isAuthenticated()) {
        req.session.redirectUrl  = req.originalUrl;
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    if(!List){
        req.flash("error","Listing you requested for does not exist");
        res.redirect(`/listings`)
    }
    
    res.render("show.ejs",{List});

}
module.exports.new = async(req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log(req.originalUrl);
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You must be logged in to Access this');
    res.redirect('/login');
    next();
    } 
    res.render("newList.ejs");
   
}
module.exports.update = async(req,res, next,err)=>{
    let {id} = req.params;
    if(err === "Validationerror"){
       next(new ExpressError(400 , "Validation error Occurred"));
    }

        if(!req.isAuthenticated()){
        console.log(req.originalUrl);
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You must be logged in to Access this');
    res.redirect('/login');
    next();
}
    else{
       
 
    let list = await Listing.findById(id);
    if(!list.owner._id.equals(res.locals.currUser._id)){
        req.flash('error',"You are not the owner of this listing");
        return res.redirect(`listing/${id}/show`);
    }
    
    if(!list){
        req.flash("error","Listing you requested for does not exist");
        res.redirect(`/listings`);
    }
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});
    if(typeof req.file !== 'undefined'){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await updateList.save();
    }
    req.flash("success" , "List updated successfully !!");
    res.redirect(`/listings/${id}/show`);
    next();}
}
module.exports.delete = async(req, res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
        if(!req.isAuthenticated()){
        console.log(req.originalUrl);
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You must be logged in to Access this');
     return res.redirect('/login');
    } 
   if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash('error',"You can not  delete any listing");
        return res.redirect(`/listings/${id}/show`);
    }
    const deleteList = await Listing.findByIdAndDelete(id);
    req.flash("success" , "List Deleted Successfully !!")
    res.redirect("/listings");

} 