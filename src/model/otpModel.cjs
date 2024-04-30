const mongoose = require('mongoose')

const OTP_verification = new mongoose.Schema({
    userEmail : {
        type: String,
        required : true
    },
    otp: {
        type: String,
        required : true
    },
    resendAllowdTime :{
        type: String,
        required : true
    },
    createdAt: {
        type: String
    },
    expiresAt: {
        type: String
    }
})

const OtpModel = mongoose.model('otp',OTP_verification)

module.exports = OtpModel