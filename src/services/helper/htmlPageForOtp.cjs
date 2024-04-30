exports.otpPage = (data, otp) => {
  // Get the current hour of the day
  const currentHour = new Date().getHours();

  // Determine the greeting message based on the current hour
  let greetingMessage = "";
  if (currentHour >= 5 && currentHour < 12) {
      greetingMessage = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 18) {
      greetingMessage = "Good Afternoon";
  } else {
      greetingMessage = "Good Evening";
  }

  return `
  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Card</title>
  <style>
    body {
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
      background: linear-gradient(135deg, #2980b9, #2c3e50);
      border-radius: 16px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      padding: 40px;
      max-width: 900px;
      width: 100%;
      font-size: 1em;
      text-align: center;
      color: #fff;
  }

    h2 {
      margin-bottom: 20px;
    }

    .otp {
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
  </style>
</head>

<body class='card'>
  <h2 style="padding-right: 10px;">Hello ${data.userName} 😍😊, ${greetingMessage}  Sweet Heart!</h1>
  <h3>Your One-Time Password is : </h2>
  <div class="emojis">🔒💡✨</div>
  <div class="otp">${otp}</div>
  <p style="color: smokewhite;">Please use this OTP within the next 15 minutes.</p>
  <p class="expiry">Note: This OTP will expire after 15 minutes.</p>
</body>
</html>
  `
}