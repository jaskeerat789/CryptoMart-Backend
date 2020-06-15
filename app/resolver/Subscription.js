const { PubSub } = require("apollo-server-express");
const pubsub = new PubSub();

const types = {
    COIN_UPDATE: "COIN_UPDATE",
    TEST: "TEST"
}

const Subscription = {
    CoinUpdated: {
        resolve: (parent) =>parent.UpdatedCoin,
        subscribe: () => pubsub.asyncIterator(types.COIN_UPDATE),
    },
}

module.exports.Subscription = Subscription
module.exports.pubsub = pubsub;
module.exports.types = types;