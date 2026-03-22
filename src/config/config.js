require('dotenv').config()

if(!process.env.MONGO_URL){
    throw new Error("Environment Variables Missing !!! ");
}
if(!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REFRESH_TOKEN || !process.env.EMAIL_USER){
    throw new Error("Environment Variables Missing !!! ");
}


const config = {
    Mongo_url : process.env.MONGO_URL,
    jwt_secret : process.env.JWT_SECRET,
    client_id : process.env.CLIENT_ID,
    client_secret : process.env.CLIENT_SECRET,
    refresh_token : process.env.REFRESH_TOKEN,
    email_user : process.env.EMAIL_USER
}

module.exports=config