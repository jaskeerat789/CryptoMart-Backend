require('dotenv').config()
const debug = require('./app/log');
debug.welcome()
const express = require('express');
const grapqlPlayground = require('graphql-playground-middleware-express').default;
const db = require('./app/database')
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { readFileSync } = require('fs');
const { init, updatePrice } = require('./app/util/CoinPriceUpdate')

const typeDefs = readFileSync('./app/typedef/schema.graphql', 'utf-8');
const resolvers = require('./app/resolver');
const context = require('./app/context');
db.connectToDB.then(() => {
   
    debug.logSection("Starting Server")
    init()
    const app = express();
    const httpServer = createServer(app)

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context,
        subscriptions: {
            onConnect: () => debug.log('Connected to websocket'),
        },
        tracing: true,
    })
    server.applyMiddleware({ app });
    server.installSubscriptionHandlers(httpServer)

    app.get('/', (req, res) => res.send("Welcome to Graphql Server"));
    app.get('/playground', grapqlPlayground({ endpoint: '/graphql' }));

    httpServer.timeout = 5000;
    httpServer.listen({ port: process.env.PORT }, () => {
        debug.message(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
        debug.message(`🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${server.subscriptionsPath}`)
        debug.logSection("Fetching Rate Updates")
        setInterval(() => {
            updatePrice()
        }, 10000);
    });
})