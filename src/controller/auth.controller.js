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

    res.cookie('token',token,{
        httpOnly : true,
        secure : false,
        sameSite : "strict",
        maxAge : 7*24*60*60*1000 

    })



   return res.status(201).json({
        message : "User Login Sucessfully",
        User,
        token
    })



}

async function UserLogin(req,res){
   
    const {email, password} = req.body

    if(!email || !password){
        return res.status(401).json({
            message : "EMAIL OR PASSWORD IS REQUIRED FOR LOGIN !!"
        })
    }

    const isUserExits = await UserModel.findOne({
        email
    })

    if(!isUserExits){
        return res.status(404).json({
            message : "User Not Found Please Login first"
        })
    }
    const isPasswordRight = await bcrypt.compare(password,isUserExits.password)
 

    if(!isPasswordRight){
        return res.status(401).json({
            message : "Invalid Password"
        })
    }




    const Accesstoken  = jwt.sign({id : isUserExits._id},process.env.JWT_SECRET,{expiresIn : "15m"})

    const ReFreshToken = jwt.sign({id : isUserExits._id},process.env.JWT_SECRET,{expiresIn : "7d"})

     res.cookie('token',ReFreshToken,{
        httpOnly : true,
        secure : false,
        sameSite : "strict",
        maxAge : 7*24*60*60*1000 

    })


    return res.status(201).json({
        message : "User Login Sucessfully",
        Accesstoken
    })


}


async function GetInfo(req,res){
    const token = req.cookies.token
 console.log(token);
 
    if(!token){
        return res.status(401).json({
            message : "Token Not Found"
        })
    }

    try{
  
         let decoaded   = jwt.verify(token,process.env.JWT_SECRET)
          
         let user = await UserModel.findById(decoaded.id)

         res.status(201).json({
            message : "Data Fetch Sucessfully",
            user
         })

    }
    catch(err){
       return res.status(401).json({
        message : "Invalid Token"
       })
    }
}

module.exports={
    UserRegister,
    UserLogin,
    GetInfo
}