const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
 email : {
        type : String,
        required : true,
        require : [true,"Email Is Required For OTP Schema"],
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : [true,"User Id Is Required For OTP Schema"],
    },
    otpHash : {
        type : String,
        required : true
    },
    
},{
    timestamps : true
});

const OTPModel = mongoose.model("otps",OTPSchema);

module.exports=OTPModel;