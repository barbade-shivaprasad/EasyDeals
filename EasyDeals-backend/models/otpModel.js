const {Schema,model, default: mongoose}  = require('mongoose');

const otp = new Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expire: { type: Number, required: true },
    status: { type: String, required: true }
}, {
    timestamps: true
});

const otpModel = model('otp',otp);

module.exports = otpModel;