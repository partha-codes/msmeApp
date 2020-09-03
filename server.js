const express = require("express");
const bodyParser = require("body-parser");
var mongoose=require('mongoose');
const cors = require("cors");
const User= require("./model/user")
const ejs = require("ejs");
const app = express();
require("dotenv").config();
const {initPayment, responsePayment} = require("./paytm/services/index");

const PORT = process.env.PORT || 4000;
var conString =process.env.ATLAS_URI;



//connect to the database
mongoose.connect(conString, { useNewUrlParser: true },() => {
    console.log("DB is connected");
    
})






app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/assets", express.static(__dirname + "/assets"));
app.use(express.static(__dirname + "/views"));
app.set("view engine", "ejs");









//routes
app.get("/", (req,res)=>{
    res.render("home.ejs")
})


app.get("/privacy-policy", (req,res)=>{
    res.render("privacypolicy.ejs")
})
app.get("/refund-policy", (req,res)=>{
    res.render("refundpolicy.ejs")
})
app.get("/terms-and-condition", (req,res)=>{
    res.render("tandc.ejs")
})






//the test route 
// app.post("/test", (req,res)=>{

//     console.log(req.body);
// })











//the payment route
app.post("/paywithpaytm", (req, res) => {
    const user = new User(req.body);
    console.log(req.body);
  
    // Save the user
    user.save((err,user)=>{
        if(err)
        {
            console.log(err);
            return res.status(400).json({msg: "Unable to save the  user"})
        }})
    //Initialize the payment
    initPayment(req.body.email).then(
            success => {
               res.render("paytmRedirect.ejs", {
                resultData: success,
                        paytmFinalUrl: process.env.PAYTM_FINAL_URL
                    });
                },
                error => {
                    res.send(error);
                }
            );
});




//paytm callback route
app.post("/paywithpaytmresponse", (req, res) => {


    console.log("the payment object being passed"+req.body);
    responsePayment(req.body).then(
        success => {
            res.render("response.ejs", {resultData: "true", responseData: success});
        },
        error => {
            res.send(error);
        }
    );
});





// app is listening
app.listen(PORT, () => {
    console.log("Running on " + PORT);
});
