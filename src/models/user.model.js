const mongo = require('mongoose')

const UserScema = new mongo.Schema({
   
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
    
     
})


const UserModel = mongo.model("users",UserScema)


module.exports=UserModel