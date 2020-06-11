const mongoose = require('mongoose');
const config = require('./config.json');
const URL = process.env.DEVELOPMENT_URL;

const connectToDB = new  Promise((resolve,reject)=>{
    console.log("Connecting to Database ...");
    mongoose.connect(URL,config)
    .then(()=>{
        console.log("Connnect")
        resolve()
    })
    .catch(err=>{
        console.log(err);
        console.log("Failed to connect to MongoDB");
        process.exit(1);
    })
})
module.exports={
    connectToDB,
}