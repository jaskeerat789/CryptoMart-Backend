const Coins = require("../model/Coin");
const { ObjectId } = require('mongoose').Types;
const { GenerateToken, authenticate, validateRole } = require("../validator/Auth")

const getAllCoins = () => Coins.find({}).exec();

const createCoin = (coin) => {
    const newCoin = new Coins({ ...coin, _id: ObjectId() })
    return newCoin.save()
        .then(createdCoin => {
            console.log({ ...createdCoin._doc, id: createdCoin._id })
            return { ...createdCoin._doc, id: createdCoin._id }
        })
        .catch(err => { throw new Error(err) })
}

const deleteCoin = (coin) => {
    return Coins.deleteOne({ ...coin }).exec()
    .then(res=>{
        console.log(res)
    })
    .catch(err=>{throw new Error(err)})
}

module.exports = {
    getAllCoins,
    createCoin,
    deleteCoin
}