const transporter = require('./nodemailer.cjs')
const bcrypt = require('bcrypt')
const { gmailSmtpServer } = require('../config.service.cjs')
const { otpSend, welcomeUser, passwordChange } = require('../utils/htmlPageForEmail.cjs')

const otp = `${(Math.floor(1000 + Math.random() * 9000))}`

const mailer = async (mailoption) => {
    let responsePayload =
    {
        otp : "",
        error : null,
        statusOfOTPSent : null,
        data : ""
    }
    try {
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailoption, (err, info) => {
                if (err) {
                    console.error("Error sending OTP:", err);
                    reject(err);
                    responsePayload = { ...responsePayload, error : true, statusOfOTPSent: false, data : err};
                } else {
                    console.log("Mail sent successfully:", info.response);
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

exports.sendOtpForVerification = async (data) => {
    try {
        // Mail helper
        data.otp = otp
        const mailoption = {
            from: gmailSmtpServer.from,
            to: data.userEmail,
            subject: "Verification OTP 🔐 From E-MARKETPLACE",
            html: otpSend(data)
        }
        // Send mail stuff
        console.log("Mail Sending...")
        let response = await mailer(mailoption)
        console.log("response :",response)
        return response
    } catch (error) {
       console.log({ "message ": error.message })
    }
}

exports.changePassword = async (data) => {
    try {
        // Mail helper
        const mailoption = {
            from: gmailSmtpServer.from,
            to: receiver.userEmail,
            subject: "Verification OTP 🔐 From E-MARKETPLACE",
            html: otpPage(data)
        }
        // Send mail stuff
        console.log("Mail Sending...")
        let response = await mailer(mailoption)
        return response
    } catch (error) {
       console.log({ "message ": error.message })
    }
}

exports.welcomeMail = async (data) => {
    try {
        console.log("data :",data)
        // Mail helper
        const mailoption = {
            from: gmailSmtpServer.from,
            to: data.userEmail,
            subject: `Welcome to E-MARKETPLACE ! ${data.userName} `,
            html: welcomeUser(data)
        }
        // Send mail stuff
        console.log("Mail Sending...")
        let response = await mailer(mailoption)
        return response
    } catch (error) {
       console.log({ "message ": error.message })
    }
}

exports.resetPwdMailer = async (data) => {
    try {
        // Mail helper
        const mailoption = {
            from: gmailSmtpServer.from,
            to: data.userEmail,
            subject: "Alert Password Changed 🔐",
            html: await passwordChange(data)
        }
        // Send mail stuff
        console.log("Mail Sending...")
        let response = await mailer(mailoption)
        return response
    } catch (error) {
       console.log({ "message ": error.message })
    }
}

exports.profileUpdateMailer = async (data) => {
    try {
        // Mail helper
        const mailoption = {
            from: gmailSmtpServer.from,
            to: data.userEmail,
            subject: "Alert Profile Updated ",
            html: await passwordChange(data)
        }
        // Send mail stuff
        console.log("Mail Sending...")
        let response = await mailer(mailoption)
        return response
    } catch (error) {
       console.log({ "message ": error.message })
    }
}