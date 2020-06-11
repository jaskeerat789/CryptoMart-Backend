const mongoose = require('mongoose');
const { String, ObjectId } = mongoose.Schema.Types

const UserSchema = new mongoose.Schema(
    {
        _id: {
            type: ObjectId,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ["CUSTOMER", "ADMIN"],
            default: "CUSTOMER",
        },
        password: {
            type: String,
            required: true,
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