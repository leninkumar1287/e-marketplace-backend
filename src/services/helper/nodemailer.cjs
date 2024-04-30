
const nodemailer = require('nodemailer')
const { gmailSmtpServer } = require('../config.service.cjs')
require('dotenv').config()

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user : gmailSmtpServer.from,
        pass : gmailSmtpServer.password
    }
})

module.exports = transporter;
