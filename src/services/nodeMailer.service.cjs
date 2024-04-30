const nodemailer = require('nodemailer');
const { gmailSmtpServer } = require('./config.service.cjs')

// Create a Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailSmtpServer.from,
        password: gmailSmtpServer.password
    }
});

// Function to generate a random OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
}

// Function to send OTP email
function sendOTPEmail(email, otp) {
    const mailOptions = {
        from: gmailSmtpServer.from, // Sender address (must be your Gmail address)
        to: email, // Recipient address
        subject: 'Your One-Time Password (OTP)', // Email subject
        text: `Your OTP is: ${otp}` // Email body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

// Example usage:
const email = 'abcdwxyz1636@gmail.com'; // Recipient's email address
const otp = generateOTP(); // Generate a random OTP
sendOTPEmail(email, otp); // Send the OTP email
