const mongoose = require('mongoose');
const config = require('./config.json');
const URL = process.env.DEVELOPMENT_URL;
const Users = require('../model/User');
const salt = parseInt(process.env.SALT_ROUNDS)
const bcrypt = require('bcryptjs')
const debug = require('../log')

const connectToDB = new  Promise((resolve,reject)=>{
    debug.logSection("Connecting to Database ...");
    mongoose.connect(URL,config)
    .then(()=>{
        debug.message("Connected")
        Users.find({number:"+9100000000"}).exec()
        .then(adminUser=>{
            if(adminUser.length==0)
            {
                const initAdmin = new Users({
                    _id:mongoose.Types.ObjectId(),
                    // username:'admin',
                    // name:"Admin",
                    // email:"admin@admin.com",
                    // password:bcrypt.hashSync("admin123",salt),
                    number:"+9100000000",
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
        .catch(err=>debug.error(err))
    })
    .catch(err=>{
        debug.error(err);
        debug.error("Failed to connect to MongoDB");
        process.exit(1);
    })
})
module.exports={
    connectToDB,
}