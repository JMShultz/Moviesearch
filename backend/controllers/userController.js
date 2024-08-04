import User from '../models/User.js';
import bcryptjs from "bcryptjs";
import asynceHandler from '../middleware/asyncHandler.js';


import createToken from '../utils/createToken.js';




const createUser= asynceHandler(async(req,res)=>{


    const{username, email,password}=req.body;

    console.log(username);
    console.log(email);
    console.log(password);

});

export {createUser};