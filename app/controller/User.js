const Users = require('../model/User');
const bcrypt = require('bcryptjs')
const { ObjectId } = require('mongoose').Types
const { GenerateToken, authenticate, validateRole } = require("../validator/Auth")

const findUser = (username, password) => {
    return Users.find({ username }).exec()
        .then((searchedUser) => {
            if (searchedUser.length === 1) {
                if (bcrypt.compareSync(password, searchedUser[0].password))
                    return {
                        token: GenerateToken({ username, id: searchedUser[0]._id }),
                        user: { ...searchedUser[0]._doc, id: searchedUser[0]._id }
                    }
                else {
                    throw new Error("Wrong Username and password")
                }
            }
            else if (searchedUser.length === 0) throw new Error("Wrong Username and password")
            else throw new Error("Multiple USers found")
        })
        .catch(err => new Error(err))
}

const createUser = (user) => {
    const salt = parseInt(process.env.SALT_ROUNDS)
    const newuser = new Users({
        ...user,
        _id: ObjectId(),
        password:bcrypt.hashSync(user.password,salt),
    })
    return newuser.save()
        .then(createdUser => {
            return {
                token: GenerateToken({ id: createdUser._id, username: createdUser.username }),
                user: createdUser
            }
        })
        .catch(err => { throw new Error(err) })
}

module.exports = {
    findUser,
    createUser,
}