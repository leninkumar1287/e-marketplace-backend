// Get the current hour of the day
const currentHour = new Date().getHours();

// Determine the greeting message based on the current hour
let greetingMessage = "";
if (currentHour >= 5 && currentHour < 12) {
    greetingMessage = "Good Evening";
} else if (currentHour >= 12 && currentHour < 18) {
    greetingMessage = "Good Afternoon";
} else {
    greetingMessage = "Good Morning";
}

const style = `body {
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.card {
  background: linear-gradient(135deg, #4b4b4b, #2c3e50);
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  padding: 40px;
  max-width: 900px;
  width: 100%;
  font-size: 1em;
  color: #fff;
}

h2 {
  margin-bottom: 20px;
}

h1 {
  color: #007bff;
}
p {
  margin-bottom: 20px;
}
.signature {
  margin-top: 40px;
}
.signature p {
  margin: 5px 0;
}

.data {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  color: yellow;
}

.emojis {
  font-size: 24px;
  margin-bottom: 20px;
}

.copy-button {
  background-color: #fff;
  color: #2980b9;
  padding: 12px 24px;
  border: 2px solid #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
  font-size: 16px;
}

.copy-button:hover {
  background-color: #2980b9;
  color: #fff;
  border-color: #2980b9;
}

.expiry {
  color: red;
}
.thanks {
  color : #7cb343;
}
`

const head = `
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${style}
  </style>
</head>`


exports.welcomeUser = (data) => {
  return `
  <!DOCTYPE html>
<html lang="en">
${head}
<body class='card'>
  <h1 class="thanks">Thank You for Joining Us!</h1>
  <h2 style="padding-right: 10px;">Hello ${data.userName} 😍😊, ${greetingMessage}  Sweet Heart!</h1>
  <h3>Your profile is successfully registered ✅</h2>
  <p>Dear ${data.userName},</p>
    <p>I hope this email finds you well! I wanted to take a moment to extend a warm welcome to you as a new member of our < community. Thank you for choosing to register with us!</p>
    <p>We're thrilled to have you on board, and we're committed to providing you with an exceptional experience, we're here to support you every step of the way.</p>
    <p>As a token of our appreciation, here's a special offer [if applicable, mention any discounts, free trials, or bonuses new users receive].</p>
    <p>If you have any questions, feedback, or just want to say hello, feel free to reach out to us via Email given below at . We're here to help!</p>
    <p>Once again, thank you for joining us. We're excited to embark on this journey together.</p>
    <div class="container">
    <br/>
      <p>Best regards,</p>
      <p>Jhony Sins<br>SMS Engineer<br>SMS Group Of Companies<br>
      123 Main Street<br>
      Cityville, CA 12345<br>
      Phone: (555) 555-5555<br>
      Email: <span style="color: white; text-decoration: underline;">john.sins@example.com</span><br>
      Website: <a href="http://www.smsgroupofcompanies.com" style="text-decoration: none; color: white; cursor: pointer; border-bottom: 1px solid black;">www.smsgroupofcompanies.com</a>
      </p>
    </div>
  <h3 >You will receive the service messages to this Email address</h3>
</body>
</html>
  `
}


exports.otpSend = (data) => {
  return `
  <!DOCTYPE html>
<html lang="en">
${head}
<body class='card'>
  <h2 style="padding-right: 10px;">Hello ${data.userName} 😍😊, ${greetingMessage}  Sweet Heart!</h1>
  <h3>Your One-Time Password is : </h2>
  <div class="emojis">🔒💡✨</div>
  <div class="data">${data.otp}</div>
  <p style="color: smokewhite;">Please use this OTP within the next 15 minutes.</p>
  <p class="expiry">Note: This OTP will expire after 15 minutes.</p>
</body>
</html>
  `
}


exports.passwordChange = async (data) => {
  return `
  <!DOCTYPE html>
<html lang="en">
${head}
<body class='card'>
  <h2 style="padding-right: 10px;">Hello ${data.userName} 😍😊, ${greetingMessage}  Sweet Heart!</h1>
  <h3>Your One-Time Password is : </h2>
  <div class="emojis"></div>
  <div class="data">${data.message} ✅ !</div>
  <p style="color: smokewhite;">Please use this OTP within the next 15 minutes.</p>
  <p class="expiry">Note: This OTP will expire after 15 minutes.</p>
</body>
</html>
  `
}

exports.wrongLoginAttempt = async (data) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
${head}
<body class='card'>
  <h2 style="padding-right: 10px;">Hello ${data.userName}, ${greetingMessage}  Sweet Heart!</h1>
  <h3>Your One-Time Password is : </h2>
  <div class="emojis"></div>
  <div class="data">${data.message} 🛑 🚫 </div>
  <p style="color: smokewhite;">Login Attempted, Is that you trying to login 🤔</p>
  <p class="expiry">Note: This OTP will expire after 15 minutes.</p>
</body>
</html>
  `
}


exports.profileDelete = async (data) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
${head}
<body class='card'>
  <h2 style="padding-right: 10px;">Hello ${data.userName}, ${greetingMessage}  Sweet Heart!</h1>
  <h3>Your One-Time Password is : </h2>
  <div class="emojis"></div>
  <div class="data">${data.message} 🗑️ 🚮 </div>
  <p style="color: smokewhite;">We Miss you, See you again, bubye 🤔</p>
  <p class="expiry">Note: We're keeping your order history for future Purpose, Not your persnol data</p>
</body>
</html>
  `
}



exports.profileUpdate = async (data) => {
  return `
  <!DOCTYPE html>
<html lang="en">
${head}
<body class='card'>
  <h2 style="padding-right: 10px;">Hello ${data.userName} 😍😊, ${greetingMessage}  Sweet Heart!</h1>
  <div class="emojis"></div>
  <div class="data">${data.message} ✅ !</div>
  <p style="color: smokewhite;">"We're always happy to help you. Have a great day! 😊"</p>
</body>
</html>
  `
}