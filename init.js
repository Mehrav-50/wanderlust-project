

const initData = require("./data.js");
const Listing = require("./model.js");
const mongoose = require("mongoose");
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then((res)=>{
    console.log("res");
})
.catch((err)=>{
    console.log(err);
})
const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj ,  owner : '6781039147bbf7834b748619'}));
    await Listing.insertMany(initData.data)
    console.log(initData.data);
   
    
    console.log("data was initialised");
};
initDB();
