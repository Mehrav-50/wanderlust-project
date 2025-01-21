const User  = require("../userModel.js");
module.exports.signupPost = async (req, res)=>{
    try{
    let {email , username , password} = req.body;
    let newUser = new User(req.body);
    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            console.log(err);
            return next(err);
        }
        req.flash("success" , "Registered Successfully!!");
        res.redirect("/listings")  })
   }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}
module.exports.loginPost = 
    async (req,res)=>{
        req.flash("success" , "Logged In Successfully!!");
        let redirect = res.locals.redirectUrl || "/listings";
        res.redirect(redirect);
    }
    module.exports.logout =  async(req,res,next)=>{
        req.logout((err)=>{
            if(err){
                console.log(err);
                return next(err);
            }
            req.flash("success", "Logged Out Successfully!!");
            res.redirect("/listings");
        })
    }