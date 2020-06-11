const mongoose = require('mongoose');
const config = require('./config.json');
const URL = process.env.DEVELOPMENT_URL;
const Users = require('../model/User');
const salt = parseInt(process.env.SALT_ROUNDS)
const bcrypt = require('bcryptjs')
const connectToDB = new  Promise((resolve,reject)=>{
    console.log("Connecting to Database ...");
    mongoose.connect(URL,config)
    .then(()=>{
        console.log("Connected")
        Users.find({username:"admin"}).exec()
        .then(adminUser=>{
            if(adminUser.length==0)
            {
                const initAdmin = new Users({
                    _id:mongoose.Types.ObjectId(),
                    username:'admin',
                    name:"Admin",
                    email:"admin@admin.com",
                    password:bcrypt.hashSync("admin123",salt),
                    role:"ADMIN"
                })
                initAdmin.save()
                .then(resolve())
                .catch(reject("failed to create Admin User"))
            }
            else if(adminUser.length ==1)
                resolve()
            else reject("Please Clean Database, more than one root Admin exists")
        })
        .catch(err=>console.log(err))
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