const bcrypt = require('bcrypt')
const OtpModel = require("../../model/otpModel.cjs");
const UserModel = require("../../model/userModel.cjs");
const { StatusCodes } = require("http-status-codes");
const { successFormat, errorMsgFormat } = require("../utils/messageFormatter.cjs");

var sampleFormat = {};

async function checker(user) {
    let checkOtpAvailable = await OtpModel.findOne({ userEmail: user.userEmail })
    if (checkOtpAvailable ? checkOtpAvailable.expiresAt > Date.now() : false) {
        let Decrypt = await bcrypt.compare(user.otp, checkOtpAvailable.otp)
        if (Decrypt) {
            sampleFormat.error = false;
            sampleFormat.code = StatusCodes.OK
            return successFormat(true, "OTP Verifier", StatusCodes.OK, "OTP Verified Successfully")
        }
        else return errorMsgFormat(" Wrong OTP ", '', StatusCodes.BAD_REQUEST)
    }
    return errorMsgFormat({ message: "OTP Expired, Please resend the OTP" }, "OTP Verification", StatusCodes.NOT_FOUND)
}

exports.resetPasswordOTPverifier = async (user) => {
    let result = await checker(user)
    return result
}

exports.profileUpdateOTPverifier = async (user) => {
    let result = await checker(user)
    return result
}