const { authenticate, validateRole } = require("../validator/Auth")
const Coin = require("../controller/Coin")
const Cart = require('../controller/Cart')
const debug = require('../log');

const coinList = () => {
    return Coin.getAllCoins()
        .then(listOfCoins => {
            return listOfCoins.map(e => {
                return { ...e._doc, id: e._id }
            })
        })
        .catch(err => { throw new Error(err) })
}

const me = authenticate((_,__,{currentUser})=>{
    // debug.message(currentUser)
    return currentUser
})

const cart = authenticate((_,{input},{currentUser})=>{
    return Cart.getACart(input,currentUser)
})

module.exports = {
    coinList,
    me,
    cart
}
