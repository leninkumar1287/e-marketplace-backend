const transporter = require('./nodemailer.cjs')
const bcrypt = require('bcrypt')
const { gmailSmtpServer } = require('../config.service.cjs')
const { otpPage } = require('./htmlPageForOtp.cjs')
const { otp } = require('./otpGenerator.helper.cjs')
/*********************************
 * Send OTP to Users
 *
 * @param {string}      Name
 * @param {string}      UserId
 * @param {string}      email
 * @param {string}      password
 * 
 * @returns {function}
 *********************************/

exports.sendOTPforVerification = async (receiver) => {
    let responsePayload =
    {
        otp : "",
        error : null,
        statusOfOTPSent : null,
        data : ""
    }

    const otp = `${(Math.floor(1000 + Math.random() * 9000))}`

    try {
        // To create a 4 digit random number (OTP)
        // Mail helper
        const mailoption = {
            from: gmailSmtpServer.from,
            to: receiver.userEmail,
            subject: "verify your mail",
            html: otpPage(receiver,otp)
        }
        // Send mail stuff
        console.log("OTP sending...")

        await new Promise((resolve, reject) => {
            transporter.sendMail(mailoption, (err, info) => {
                if (err) {
                    console.error("Error sending OTP:", err);
                    reject(err);
                    responsePayload = { ...responsePayload, error : true, statusOfOTPSent: false, data : err};
                } else {
                    console.log("OTP sent successfully:", info.response);
                    responsePayload = { ...responsePayload, error : false, statusOfOTPSent: true, data : info.response, otp : otp };
                    resolve(true);
                }
            });
        });

        return responsePayload
    } catch (error) {
       console.log({ "message ": error.message })
       return responsePayload
    }
}