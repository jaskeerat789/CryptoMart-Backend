const { v4: uuidv4 } = require('uuid');
const checksum = require("../util/checksum/checksum")
const fetch = require('node-fetch');


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
        paylaod["CHECKSUMHASH"] = checksumValue
        return paylaod
    }
    catch (error) {
        console.log(error)
    }
}

const callback = (req, res, next) => {
    const response = req.body;
    const checksumhash = response.CHECKSUMHASH
    delete response.CHECKSUMHASH
    var valid=checksum.verifychecksum(response,process.env.PAYTM_MK,checksumhash)
    const paytmParam = {
        MID:response.MID,
        ORDERID:response.ORDERID,
        CHECKSUMHASH:checksumhash,
    }
    fetch(`${process.env.API_URL}`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Content-Length":JSON.stringify(paytmParam).length
        },
        body:JSON.stringify(paytmParam)
    })
    .then(response=>response.json())
    .then(json=> console.log(json))
    res.redirect(process.env.APP_URL,302)
}

module.exports = {
    createPayload,
    callback
} 