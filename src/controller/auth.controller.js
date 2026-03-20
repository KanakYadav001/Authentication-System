const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

async function UserRegister(req,res){

    const {username,email,password} = req.body

    if(!username || !email || !password){
        return res.status(401).json({
        message : "USERNAME , EMAIL ,PASSWORD IS REQUIRED FOR REGISTER !!"
        })
    }

    const isUserExits = await UserModel.findOne({
         $or : [
          {email : email},
          {username :username}
         ]
    })


    if(isUserExits){
        return res.status(401).json({
            message : "User Already Exits"
        })
    }
    const hashPassword  = await bcrypt.hash(password,10)

    const User = await UserModel.create({
        username,
        email,
        password : hashPassword
    })


    const token  = jwt.sign({id : User._id},process.env.JWT_SECRET)

    res.cookie('token',token)



   return res.status(201).json({
        message : "User Login Sucessfully",
        User
    })



}

async function UserLogin(req,res){

}


module.exports={
    UserRegister,
    UserLogin
}