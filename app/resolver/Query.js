const { authenticate, validateRole } = require("../validator/Auth")
const Coin = require("../controller/Coin")

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
    console.log(currentUser)
    return currentUser
})

module.exports = {
    coinList,
    me
}
