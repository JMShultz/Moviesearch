import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

const authenticate= asyncHandler(async(req,res, next)=>{


let token;
token =req.cookies.Jwt
if(token){
    try{
const decoded =jwt.verify(token,process.env.JWT_SECRET);

req.User=await User.findById(decoded.UserId).select("-password");
next();
    }catch(error){
        res.status(401);
        throw new Error("not found");
    }
}else{
    res.status(401)
    throw new Error("not authorized, no token")
}

});



const authorizeAdmin=(req,res, next)=>{

    if (req.user && req.user.isAdmin){

        next();
    }else{
        res.status(401).send("not authorized as admin");
    }
};

export {authenticate,authorizeAdmin};