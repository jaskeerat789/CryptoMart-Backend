const mongoose = require('mongoose');
const { String, Number, ObjectId } = mongoose.Schema.Types

const ListOfCoins = new mongoose.Schema({
    coin: {
        type: ObjectId,
        required: true,
        ref: 'Coins'
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    amount:{
        type:Number,
        required:true,
        min:0
    }
},{
    _id:false
})

const CartSchema = new mongoose.Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    coins: [ListOfCoins],
    paymentStatus: {
        type: String,
        enum: [null, "success", "rejected", "pending"],
        default: null
    },
    userId:{
        type:ObjectId,
        required:true,
        ref:"Users"
    }
},
    {
        timestamps: {
            updatedAt: "updatedAt",
            createdAt: "createdAt",
        }
    }
)



module.exports = mongoose.model("Carts", CartSchema)