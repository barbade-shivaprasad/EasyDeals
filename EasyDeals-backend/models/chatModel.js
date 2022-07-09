const { default: mongoose } = require("mongoose");

const schema = mongoose.Schema({sender:String,message:String})
const chatModel = mongoose.model('chatModel',schema)

module.exports = {schema,chatModel};