const { authenticate, validateRole } = require("../validator/Auth")
const User = require("../controller/User")
const Coin = require("../controller/Coin")
const Cart = require('../controller/Cart')
const Payment = require('../controller/Payment')

const login = async (_, { input }) => {
    const { username, password } = input;
    if (username && password) return User.findUser(username, password)
    else throw new Error("Incomplete fields")
}

const register = async (_, { input }, { currentUser }) => {
    if (input.role && input.role == "ADMIN" && currentUser)
        return User.createUser(input)
    else if (!input.role || input.role == "CUSTOMER")
        return User.createUser(input)
    else return new Error("Admins can only creat accounts with ADMIN role")
}

const createCoin = authenticate(validateRole("ADMIN")((_, { input }) => {
    return Coin.createCoin(input)
}))

const deleteCoin = authenticate(validateRole("ADMIN")((_, { input }) => {
    return Coin.deleteCoin(input)
}))

const createCart = authenticate((_, { input }, { currentUser }) => {
    return Cart.createCart(input, currentUser)
})

const updateCart = authenticate((_, { input }, { currentUser }) => {
    return Cart.updateCart(input, currentUser)
})

const addCoinToCart = authenticate(async (_, { input }, { currentUser }) => {
    return Cart.addCoinToCart(input, currentUser)
})

const createPayment = authenticate((_, { input }, { currentUser }) => {
    return Payment.createPayload(input,currentUser)
 })


module.exports = {
    login,
    register,
    createCoin,
    deleteCoin,
    createCart,
    updateCart,
    addCoinToCart,
    createPayment
}