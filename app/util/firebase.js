const admin = require('firebase-admin')
admin.initializeApp({
  credential: admin.credential.applicationDefault()
})

const getEpoch = () => {
  date = new Date()
  return Math.floor(date.getTime() / 1000)
}

const verifyToken = (token, number) => {
  return admin.auth().verifyIdToken(token, true)
    .then(res => {
      if (res.exp > getEpoch() && res.phone_number == number) {
        return Promise.resolve()
      }
      else return Promise.reject({ status: "NOT_VERIFIED" })
    })
    .catch(err => Promise.reject({ status: "ERROR",err }))
}

module.exports = {
  verifyToken
}