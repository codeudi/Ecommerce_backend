const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const keysecret = process.env.KEY

const authenicate = async(req,res,next)=>{
    try {
        console.log("cookies : ",req.cookies)
        const {token} = req.cookies;
        console.log("token : ",token)
        const verifyToken = await jwt.verify(token,keysecret);
        console.log("verifyToke : ",verifyToken)
        const rootUser = await User.findOne({_id:verifyToken._id,"tokens.token":token});
       console.log("rootuser : ",rootUser)

        if(!rootUser){ throw new Error("User Not Found") };

        req.token = token; 
        console.log("reqtoken : ",req.token)
        req.rootUser = rootUser; 
        console.log("rootuser : ",req.rootUser)  
        req.userID = rootUser._id;   
        console.log("req.userID: ",req.userID)
    
        next();  


    } catch (error) {
        res.status(401).send("Unauthorized:No token provided");
        console.log(error);
    }
};

module.exports = authenicate;