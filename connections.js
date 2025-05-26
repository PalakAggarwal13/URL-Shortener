const mongoose = require("mongoose");
mongoose.set('strictQuery',true);

async function connectMongoose(url){
   return mongoose.connect(url);
}

module.exports = {
    connectMongoose
}
