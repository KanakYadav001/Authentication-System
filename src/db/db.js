const mongo = require('mongoose');


async function ConnectToDB(){
    try{
        await mongo.connect(process.env.MONGO_URL);
         console.log("DB Connected Successfully");
    } catch(err){
        console.log("DB Not Connect !!!");
    }
}


module.exports=ConnectToDB