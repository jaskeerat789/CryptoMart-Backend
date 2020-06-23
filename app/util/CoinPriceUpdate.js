const Coins = require('../model/Coin');
const { ObjectId } = require('mongoose').Types;
const fetch = require('node-fetch')
const pubsub = require('../resolver/Subscription').pubsub
const types = require('../resolver/Subscription.js').types;
const debug = require('../log')

const BASE_URL = "https://api.wazirx.com/api/v2/tickers"
const COINS = [
    {
        apiname: "btcinr", name: "BitCoin", short: "btc", url:
        [
            "https://s2.coinmarketcap.com/static/img/coins/32x32/1.png",
            "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
            "https://s2.coinmarketcap.com/static/img/coins/128x128/1.png",
        ]
    },
]
const init = () => {
    COINS.forEach(element => {
        const coin = new Coins({ ...element, _id: ObjectId() })
        coin.save().catch(err =>{})
    });
}

const getData = () =>
    fetch(BASE_URL)
        .then(res => res.json())
        .then(json => json)
        .catch(err => {
            debug.error(err)
            return Promise.reject(err)
        })

const updatePrice = async()=>{
    try {
        let data = await getData()
        COINS.forEach(element => {
            coin=data[element.apiname]
            // debug.message(coin.sell)
            Coins.findOneAndUpdate({short:element.short},{$set:{rate:coin.sell}}).exec()
            .then(updatedCoin=>{
                // console.log(updatedCoin)
                pubsub.publish(types.COIN_UPDATE,{UpdatedCoin:[{...updatedCoin._doc,id:updatedCoin._id}]})
            })
            .catch(err=>debug.error(err))
            // pubsub.publish(types.COIN_UPDATE,)
        });
    } catch (error) {
        debug.error(error)
    }
}

module.exports={
    updatePrice,
    init
}