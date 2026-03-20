const mongo = require('mongoose')

const UserScema = new mongo.Schema({

    
})


const UserModel = mongo.model("users",UserScema)


module.exports=UserModel