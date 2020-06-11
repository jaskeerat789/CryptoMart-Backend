const mongoose = require('mongoose');
const { String, ObjectId, Number } = mongoose.Schema.Types

const PaymentSchema = new mongoose.Schema(
    {
        _id: {
            type: ObjectId,
            required: true,
        },
        cartId: {
            type: ObjectId,
            required: true,
            ref: 'Carts'
        },
        userId: {
            type: ObjectId,
            required: true,
            ref: "Users"
        },
        amount: {
            type: Number,
            required: true,
        },
        status:{
            type:String,
            enum:[null,"Pending Verification","Complete","Rejected","Canceled"],
            default:null
        }
    },
    {
        timestamps: {
            updatedAt: "updatedAt",
            createdAt: "createdAt",
        }
    }
)

module.exports = mongoose.model('Payments',PaymentSchema)