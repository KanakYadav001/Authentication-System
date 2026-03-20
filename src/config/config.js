require('dotenv').config()

if(!process.env.MONGO_URL){
    throw new Error("Enviroment Variables Missing !!! ");
    
}


const config = {
    Mongo_url : process.env.MONGO_URL
}

module.exports=config