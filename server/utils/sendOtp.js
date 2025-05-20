// utils/sendOtp.js
const nodemailer = require('nodemailer');

// Sends OTP to user's email using Gmail + App Password
const sendOtp = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"TuneUp OTP" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code for TuneUp Password Reset',
    text: `Your one-time password (OTP) is: ${code}\nThis code will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOtp;
