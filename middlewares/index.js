const express = require('express');
const app = express();
const port = 8080;
const ExpressError = require('./errors/error.js');
app.listen(port);
app.use("/api" , (req,res , next)=>{
    let {token}= req.query;
    if(token == "give access"){
        return next();
    }
    else {
        throw new ExpressError(404,"Access Denied");
    }
})
app.get("/admin",(req,res,next)=>{
    
    throw new ExpressError(403,"Access Denied");
})
app.use((err,req,res,next)=>{
    let {status , message} = err;
    res.status(status).send(message);
    next(err);
})
app.get('/api',(req,res)=>{
    res.send("Welcome to the Homepage");
})