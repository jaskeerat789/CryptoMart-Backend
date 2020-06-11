require('dotenv').config()
const express = require('express');
const grapqlPlayground = require('graphql-playground-middleware-express').default;
const db = require('./app/database')
const {ApolloServer} = require('apollo-server-express');
const {createServer} = require('http');
const {readFileSync} = require('fs');

const typeDefs = readFileSync('./app/typedef/schema.graphql','utf-8');
const resolvers = require('./app/resolver');
const context = require('./app/context');

const app = express();
const httpsServer = createServer(app)

db.connectToDB.then(()=>{
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context,
    })
    server.applyMiddleware({app});
    app.get('/',(req,res)=>res.send("Welcome to Graphql Server"));
    app.get('/playground',grapqlPlayground({endpoint:'/graphql'}));
    server.installSubscriptionHandlers(httpsServer);
    httpsServer.timeout=5000;
    httpsServer.listen({port:process.env.PORT},()=>console.log(`Server is running at https://localhost:${process.env.PORT}`));
})