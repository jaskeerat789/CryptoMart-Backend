const { TradeTokenForUser } = require('../validator');
const debug = require('../log')

const context = async ({ req, res }) => {
    let authToken = null;
    let currentUser = null;
    try {
        if (typeof req.headers !== 'undefined') {
            authToken = req.headers.authentication;
            if (authToken) {
                currentUser = await TradeTokenForUser(authToken);
            }
        }
    } catch (error) {
        debug.log("error in authentication")
    }
    return {
        currentUser,
        req,
        res,
    }
}

module.exports = context