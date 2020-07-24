const Users = require('../model/User');
const bcrypt = require('bcryptjs')
const { ObjectId } = require('mongoose').Types
const { GenerateToken, authenticate, validateRole } = require("../validator/Auth")
const { verifyToken } = require('../util/firebase');
const findUser = (number, firebaseToken) => {
    return Users.find({ number }).exec()
        .then((searchedUser) => {
            if (searchedUser.length === 1) {
                return verifyToken(firebaseToken, number)
                    .then(() => {
                        return {
                            token: GenerateToken({ number, id: searchedUser[0]._id }),
                            user: { ...searchedUser[0]._doc, id: searchedUser[0]._id }
                        }
                    })
                    .catch((err) => {
                        if (err.status === "NOT_VERIFIED")
                            throw new Error("User not Authenticated")
                        else throw new Error("Unable to verify user")
                    })
            }
            else if (searchedUser.length === 0) return createUser(number,firebaseToken)
            else throw new Error("Multiple USers found")
        })
        .catch(err => new Error(err))
}

const createUser = (number, firebaseToken) => {
    // const salt = parseInt(process.env.SALT_ROUNDS)
    return verifyToken(firebaseToken, number)
        .then(res => {
            const newuser = new Users({
                number,
                _id: ObjectId(),
            })
            return newuser.save()
                .then(createdUser => {
                    return {
                        token: GenerateToken({ id: createdUser._id, number: createdUser.number }),
                        user: createdUser
                    }
                })
                .catch(err => { throw new Error(err) })
        })
        .catch(err => {
            if (err.status === "NOT_VERIFIED")
                throw new Error("User not Authenticated")
            else throw new Error("Unable to verify user")
        })
}

module.exports = {
    findUser,
    createUser,
}