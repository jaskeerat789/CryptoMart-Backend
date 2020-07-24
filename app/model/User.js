const mongoose = require('mongoose');
const { String, ObjectId } = mongoose.Schema.Types

const UserSchema = new mongoose.Schema(
    {
        _id: {
            type: ObjectId,
            required: true,
        },
        number: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ["CUSTOMER", "ADMIN"],
            default: "CUSTOMER",
        },
        carts: [{
            type: ObjectId,
            ref: "Carts"
        }],
        payments:[{
            type:ObjectId,
            ref:"Payments"
        }]
    },
    {
        timestamps: {
            updatedAt: "updatedAt",
            createdAt: "createdAt",
        }
    }
)
module.exports = mongoose.model("Users", UserSchema)