const {PubSub} = require("apollo-server-express");
const { TradeTokenForUser } = require('../validator');

const pubsub = new PubSub();

const context = async ({ req, res }) => {
    let authToken = null;
    let currentUser = null;
    try {
        authToken = req.headers.authentication;
        if (authToken) {
            currentUser = await TradeTokenForUser(authToken);
        }
    } catch (error) {
        console.log(error)
    }
    return {
        currentUser,
        req,
        res,
        pubsub
    }
}

module.exports = context