const { v4: uuidv4 } = require('uuid');
const checksum = require("../util/checksum/checksum")
const User = require('../model/User')


const createPayload = async (input, currentuser) => {
    // console.log(input,currentuser)
    try {
        let paylaod = {
            MID: process.env.PAYTM_MID,
            ORDER_ID: uuidv4(),
            CUST_ID: currentuser._id,
            TXN_AMOUNT: input.amount,
            CHANNEL_ID: "WAP",
            WEBSITE: "WEBSTAGING",
            INDUSTRY_TYPE_ID: "Retail",
            CALLBACK_URL: process.env.CALLBACK_URL,
            EMAIL: currentuser.email
        }
        const checksumValue = await checksum.genchecksum(paylaod, process.env.PAYTM_MK)
        paylaod["CHECKSUMHASH"]=checksumValue
        return paylaod
    }
    catch(error){
        console.log(error)
    }
}

module.exports = {
    createPayload
} 