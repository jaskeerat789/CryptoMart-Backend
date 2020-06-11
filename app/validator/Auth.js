const jwt = require('jsonwebtoken');
const User = require('../model/User')

const authenticate = next => (root, args, context, info) => {
    if (!context.currentUser) {
        throw new Error(`Unauthenticated!`);
    }
    return next(root, args, context, info);
};

const TradeTokenForUser = (token) => {
    const data = jwt.verify(token, process.env.JWT_SECRET)
    return User.findById({ _id: data.id })
        .populate({
            path: 'carts',
            model: "Carts",
            populate:{
                path:"coins",
                populate:{
                    path:"coin",
                    populate:"Coins"
                }
            }
        })
        .exec()
        .then(user =>user)
        .catch(err => console.log(err))
}

const validateRole = role => next => (root, args, context, info) => {
    if (context.currentUser.role !== role) {
        throw new Error(`Unauthorized!`);
    }
    return next(root, args, context, info);
};


const GenerateToken = ({ id, username }) => {
    return jwt.sign({
        id,
        username,
    }, process.env.JWT_SECRET)
}
module.exports = {
    authenticate,
    TradeTokenForUser,
    GenerateToken,
    validateRole
}