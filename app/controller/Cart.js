const Carts = require('../model/Cart')
const Coins = require('../model/Coin')
const User = require('../model/User')
const lodash = require('lodash')
const { ObjectId } = require('mongoose').Types
const debug = require('../log')
const { populate } = require('../model/User')

const merge = (orders, listOfCoin) => {
    let arr = [];
    orders.forEach(order => {
        listOfCoin.forEach(coin => {
            if (order.id == ObjectId(coin._id)) {
                arr.push({
                    coin,
                    amount: order.amount,
                    quantity: order.amount / coin.rate
                })
            }
        });
    });
    return arr
}


const createCart = (cart, currentUser) => {
    return Coins.find({
        _id: { $in: cart.map(e => ObjectId(e.id)) }
    })
        .exec()
        .then(listOfCoin => {
            if (listOfCoin.length > 0) {
                // console.log(listOfCoin,cart)
                const ListOfCoin = merge(cart, listOfCoin)
                const newCart = new Carts({
                    _id: ObjectId(),
                    coins: ListOfCoin.map(({ coin, quantity, amount }) => { return { coin: coin._id, quantity, amount } }),
                    userId: currentUser._id
                })
                return newCart.save()
                    .then(savedCart =>
                        User.findByIdAndUpdate(
                            currentUser._id,
                            { $push: { carts: savedCart._id } }).exec()
                            .then(() => {
                                return {
                                    ...savedCart,
                                    id: savedCart._id,
                                    coins: ListOfCoin,
                                }
                            })
                    )
                    .catch(err => debug.error(err))
            }
            else throw new Error("Coins not found")
        })
        .catch(err => { throw new Error(err) })
}

const updateCart = (requestedOrder, currentUser) => {
    return Carts.findById(requestedOrder.id).exec()
        .then(currentCart => {
            if (currentCart)
                if (currentCart.userId.equals(currentUser._id)) {
                    requestedOrder.updation.forEach(element => {
                        for (let index = 0; index < currentCart.coins.length; index++) {
                            if (currentCart.coins[index].coin == element.id) {
                                currentCart.coins[index].quantity = element.quantity
                                break;
                            }
                        }
                    });
                    return Carts.findByIdAndUpdate(requestedOrder.id, { $set: { coins: currentCart.coins } }, { new: true })
                        .populate({
                            path: 'coins',
                            populate: {
                                path: 'coin',
                                model: "Coins"
                            }
                        })
                        .exec()
                        .then(updatedCart => {
                            debug.message(updatedCart)
                            return {
                                id: updatedCart._id,
                                ...updatedCart._doc
                            }
                        })
                        .catch(err => { throw new Error(err) })
                }
                else {
                    debug.error("Not Authorised")
                    return new Error("Not Authorised")
                }
            else {
                debug.error("Worng Cart Id")
                return new Error("Worng Cart Id")
            }
        })
        .catch(err => new Error(err))
}
const addCoinToCart = (requestedAddition, currentUser) => {
    requestedAddition = { ...requestedAddition, addition: { coin: requestedAddition.addition.id, quantity: requestedAddition.addition.quantity } }
    return Carts.findById(requestedAddition.id).exec()
        .then(currentCart => {
            if (currentCart) {
                if (currentCart.userId.equals(currentUser._id)) {
                    if (lodash.find(currentCart.coins, (o) => o.coin != requestedAddition.addition.id)) {
                        return Carts.findByIdAndUpdate(requestedAddition.id, { $addToSet: { coins: requestedAddition.addition } }, { new: true })
                            .populate({
                                path: 'coins',
                                populate: {
                                    path: 'coin',
                                    model: "Coins"
                                }
                            })
                            .exec()
                            .then(updatedCart => {
                                // console.log(updatedCart.coins)
                                return {
                                    id: updatedCart._id,
                                    ...updatedCart._doc
                                }
                            })
                            .catch(err => new Error(err))

                    }
                    else {
                        return new Error("coin is already in the cart")
                    }
                }
                else {
                    return new Error("Not Authorised")
                }
            }
            else {
                return new Error(`Cart with ID ${requestedAddition.id} does not exist`)
            }
        })
        .catch(err => new Error(err))

}
const getACart = ({ id }, currentUser) => {
    return Carts.findById(id)
        .populate({
            path: "coins",
            populate: {
                path: "coin",
                populate: "Coins"
            }
        })
        .exec()
        .then(res => {
            if (String(res.userId) === String(currentUser._id)) {
                return res
            }
            else throw new Error("Cart Does not Belongs to the current user")
        })
        .catch(err => err)
}

module.exports = {
    createCart,
    updateCart,
    addCoinToCart,
    getACart
}