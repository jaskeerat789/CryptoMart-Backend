const Coins = require("../model/Coin");
const { ObjectId } = require('mongoose').Types;
const debug = require('../log')

const getAllCoins = () => Coins.find({}).exec();

const createCoin = (coin) => {
    const newCoin = new Coins({ ...coin, _id: ObjectId() })
    return newCoin.save()
        .then(createdCoin => {
            return { ...createdCoin._doc, id: createdCoin._id }
        })
        .catch(err => { throw new Error(err) })
}

const deleteCoin = (coin) => {
    return Coins.deleteOne({ ...coin }).exec()
    .then(res=>{
        debug.message(res)
    })
    .catch(err=>{throw new Error(err)})
}

module.exports = {
    getAllCoins,
    createCoin,
    deleteCoin
}