const { TradeTokenForUser } = require('../validator')
const context = async ({ req }) => {
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
    }
}

module.exports = context