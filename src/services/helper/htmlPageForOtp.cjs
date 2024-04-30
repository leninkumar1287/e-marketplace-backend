exports.otpPage = (data, otp) => {
    return `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background: linear-gradient(to right, #2C3E50, #3498DB);
                        padding: 20px;
                        color: #fff;
                    }
                    .container {
                        max-width: 400px;
                        margin: 0 auto;
                        background-color: rgba(255, 255, 255, 0.8);
                        border-radius: 5px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                        padding: 20px;
                    }
                    h2 {
                        text-align: center;
                        color: #007bff;
                    }
                    p {
                        margin-bottom: 20px;
                    }
                    .otp {
                        font-size: 24px;
                        color: #28a745;
                    }
                    .expiry {
                        font-size: 14px;
                        color: #dc3545;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Password Reset OTP</h2>
                    <p>Hello <strong> ${data.userName} </strong>,</p>
                    <p>Your One-Time Password (OTP) for resetting your password is:</p>
                    <p class="otp">${otp}</p>
                    <p>Please use this OTP within the next 15 minutes.</p>
                    <p class="expiry">Note: This OTP will expire after 15 minutes.</p>
                </div>
            </body>
            </html>
        `
}