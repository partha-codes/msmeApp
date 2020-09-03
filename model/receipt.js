const mongoose = require("mongoose")



const receiptSchema = new mongoose.Schema({

    ORDER_ID:{
        type: String,
        required:true,
        trim:true}
    ,
    CUST_ID:{
        type: String,
        required:true,
        trim:true}
    , 

    CUST_EMAIL:{        
        type: String,
        required:true,
        trim:true}
        
},{timestamps: true})
module.exports = mongoose.model("Receipt", receiptSchema)