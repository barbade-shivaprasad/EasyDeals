const {Schema,model, default: mongoose}  = require('mongoose');

const dealSchema = new Schema({
    id:{required:true,type:String},
    title:{required:true,type:String},
    createdBy:{type:mongoose.Types.ObjectId,required:true},
    status:{type:String,required:true},
    type:{type:String,required:true},
    dealer:{type:String},
    dealDate:{type:String},
    description:{type:String,required:true},
    email:{type:String,required:true}
},{
    timestamps:true
})

const dealModel = model('deal',dealSchema);

module.exports = dealModel;