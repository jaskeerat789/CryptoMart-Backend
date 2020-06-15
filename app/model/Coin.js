const mongoose = require('mongoose');
const { String, Number, ObjectId, Decimal128 } = mongoose.Schema.Types

const CoinSchema = new mongoose.Schema(
    {
        _id: {
            type: ObjectId,
            required: [true, "Id is Required"],
        },
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        short: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
            uppercase: true,
        },
        rate: {
            type: Number,
            default:0,
            min: [0, "rate can't be negative"]
        },
        stock: {
            type: Number,
            default:0,
            min: [0, "Stock can't be negative"]
        },
        url:[String]
    },
    {
        timestamps: {
            updatedAt: "updatedAt",
            createdAt: "createdAt",
        }
    }
);

CoinSchema.index({ name: "short", type: -1 })

module.exports = mongoose.model("Coins", CoinSchema)