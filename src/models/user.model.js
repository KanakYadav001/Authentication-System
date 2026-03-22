const mongo = require('mongoose')

const UserSchema = new mongo.Schema({
   
    username : {
        type : String,
        required : [true,"UserName Is Required For Register a User"],
        unique : [true, "Username must Be Unique"],
        
    },
    email :{
        type : String,
        required : [true,"Email Is Required For Register a User"],
        unique : [true, "Email must Be Unique"],
    },
    password :{
        type : String,
        required : [true,"Password Is Required For Register a User"],
       
    },
    verified : {
        type : Boolean,
        default : false,
    },
    
     
})


const UserModel = mongo.model("users",UserSchema)


module.exports=UserModel