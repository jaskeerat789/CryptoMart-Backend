const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')
const { ObjectId } = require('mongoose').Types;
const MongoID = new GraphQLScalarType({
    name: 'MongoID',
    description: "MongoDB ObjectID Scalar",
    parseValue(value) {
        if (ObjectId(value).toHexString() == value)
            return ObjectId(value).toHexString()
        else throw new Error("Not a valid MongoDB ObjectID")
    },
    serialize(value) {
        if (ObjectId(value).toHexString() == value)
            return ObjectId(value).toHexString()
        else throw new Error("Not a valid MongoDB ObjectID")
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return ObjectId(ast.value).toHexString() // ast value is always in string format
        }
        return null;
    },
})

module.exports= {
    MongoID,
}