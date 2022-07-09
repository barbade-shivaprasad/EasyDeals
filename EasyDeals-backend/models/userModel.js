const {Schema,model}  = require('mongoose');
const chatSchema = require('./chatModel')

const userSchema = new Schema({
    name:{required:true,type:String},
    email:{type:String,required:true},
    password:{type:String,required:true},
    successfulDeals:{type:Number},
    phone:{type:Number,required:true},
    socId:{type:String}, 
    chat:[{name:String,email:String,unreadCount:Number,dealId:String,data:[chatSchema.schema]}]
})

const userModel = model('user',userSchema);

module.exports = userModel;