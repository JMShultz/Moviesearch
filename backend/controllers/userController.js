import User from '../models/User.js';
import bcryptjs from "bcryptjs";
import asynceHandler from '../middleware/asyncHandler.js';
import createToken from '../utils/createToken.js';




const createUser= asynceHandler(async(req,res)=>{


    const{username, email,password}=req.body;
if(!username || ! email || !password){
    throw new Error("please fill all fields")
}
const userExists = await User.findOne({email})
if (userExists) res.status(400).send("user exists!");

const salt =await bcryptjs.genSalt(10)

const hashedPassword= await bcryptjs.hash(password, salt)


const newUser = new User({username,email,password:hashedPassword})



try {
    
await newUser.save()

createToken(res, newUser._id)

res.status(201).json({

_id:newUser._id,
username:newUser.username,
email:newUser.email,
isAdmin:newUser.isAdmin,


})


} catch (error) {
    res.status(400)
    throw new Error("invalid user data.")
}



});




const loginUser= asynceHandler(async(req,res)=>{

const{email, password}=req.body;

const existingUser= await User.findOne({email})

if (existingUser){

const isPasswordValid= await bcryptjs.compare(password,existingUser.password)

if(isPasswordValid){
    createToken(res,existingUser._id)


res.status(201).json({

    _id:existingUser._id,
    username:existingUser.username,
    email:existingUser.email,
    isAdmin:existingUser.isAdmin,
    
    
    });
}else{
    res.status(401).json({message:"Invalid Password"});
}


}else{
    res.status(401).json({message:"user not found"});
}




});


const logoutCurrentUser= asynceHandler(async(req,res)=>{

res.cookie('jwt','',{

httpOnly:true,
expires:new Date(0)


})
res.status(200).json({message:"Logged out user"})



});

const GetAllUsers=asynceHandler(async(req,res)=>{

const users=await User.find({});

res.json(users);


});



const getCurrentUserProfile=asynceHandler(async(req,res)=>{


const user =await User.findById(req.user._id)

if(user){
    res.json({

        _id:user._id,
        username:user.username,
        email:user.email
    })
}else{
    res.status(404)

    throw new Error("User not found")
}


});

const UpdateCurrentUserProfile=asynceHandler(async(req,res)=>{


const user= await User.findById(req.user._id)


if(user){

    user.username= req.body.username || user.username;
    user.email= req.body.email || user.email;
    

    if(req.body.password){

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword= await bcryptjs.hash(req.body.password,salt);

        user.password=hashedPassword;
    }

const updatedUser= await user.save()

res.json({
_id:updatedUser._id,
username:updatedUser.username,
email:updatedUser.email,
isAdmin:updatedUser.isAdmin,
});

}else{
    res.status(404)
    throw new Error("User not found");
}
});


export {createUser, loginUser, logoutCurrentUser,GetAllUsers,getCurrentUserProfile,UpdateCurrentUserProfile};