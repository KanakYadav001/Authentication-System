const mongo  = require('mongoose')

const sessionScema = new mongo.Schema({
    user : {
        type : mongo.Schema.Types.ObjectId,
        ref  : "users",
        required : [true,"User Id Is Required For Session Scema"]
    },
    hashRefreshToken : {
      type : String,
      required  :[true, "Refresh Token Is Needed For Session Scema"]
    },
    ip:{
        type : String,
        required  :[true, "IP Is Needed For Session Scema"]
    },
    userAgent :{
        type : String,
        required  :[true, "User Device Info Is Needed For Session Scema"]
    },
    revoke : {
        type : Boolean,
        default : false,
    }
},{
    timestamps : true
})




const SessionModel  = mongo.model('sessions',sessionScema)



module.exports = SessionModel