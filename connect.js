const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

async function connectToMongo(url){
    return mongoose.connect(url);
}

module.exports = {
    connectToMongo,
}
