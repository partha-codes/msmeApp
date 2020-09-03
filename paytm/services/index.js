const checksum = require('../lib/checksum');
const config = require('../config');
const shortid = require('shortid');
const Receipt = require('../../model/receipt')

const initPayment = function(email) {
  return new Promise((resolve, reject) => {
    let paymentObj = {
      ORDER_ID: shortid.generate(),
      CUST_ID: shortid.generate(),
      INDUSTRY_TYPE_ID: config.INDUSTRY_TYPE_ID,
      CHANNEL_ID: config.CHANNEL_ID,
      TXN_AMOUNT: config.AMOUNT.toString(),
      MID: config.MID,
      WEBSITE: config.WEBSITE,
      CALLBACK_URL: config.CALLBACK_URL,
      CUST_EMAIL: email
     
    };
    checksum.genchecksum(
      paymentObj,
      config.PAYTM_MERCHANT_KEY,
      (err, result) => {
        if (err) {
          return reject('Error while generating checksum');
        } else {
          paymentObj.CHECKSUMHASH = result;
          return resolve(paymentObj);
        }
      }
    );
  });
};

const responsePayment = function(paymentObject) {
  return new Promise((resolve, reject) => {


    console.log(" payment object " + paymentObject.CHECKSUMHASH);
    if (
      checksum.verifychecksum(
        paymentObject,
        config.PAYTM_MERCHANT_KEY,
        paymentObject.CHECKSUMHASH
      )
    ) {//this section will be executed only when the payment is successfuL
       const customerId= paymentObject.CUST_ID;
       const orderid= paymentObject.ORDER_ID;
       const email  = paymentObject.CUST_EMAIL;
       const receipt= new Receipt({orderid,customerId,email})
       receipt.save((err, receipt)=>{
         if (err)
              return reject('Error while saving the receipt')     
          console.log("receipt was saved for the payment object below " + paymentObject);
          resolve(paymentObject);
       })

    } else {
      return reject('Error while verifying checksum');
    }
  });
};

module.exports = {
  initPayment: initPayment,
  responsePayment: responsePayment
};
