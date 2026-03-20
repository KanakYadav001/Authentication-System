const mongo = require('mongoose');
const { env } = require('process');

async function ConnectToDB(){
    try{
        await mongo.connect(process.env.MONGO_URL)
         console.log("DB Connected Sucessfully");
}catch(err){
    console.log("DB Not Connect !!!");
    
}

    
}


module.exports=ConnectToDB