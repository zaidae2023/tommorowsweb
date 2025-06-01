// Import the nodemailer package for sending emails
const nodemailer = require('nodemailer');

// Function to send an OTP email to the user
// Takes in the recipient's email and the OTP code
const sendOtp = async (email, code) => {
  // Create a transporter object using Gmail service and App Password
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,           // Your Gmail address from .env
      pass: process.env.GMAIL_APP_PASSWORD,   // App Password from Gmail (not your regular password)
    },
  });

  // Define the content and recipient of the email
  const mailOptions = {
    from: `"TuneUp OTP" <${process.env.GMAIL_USER}>`, // Sender name and email
    to: email,                                         // Receiver's email address
    subject: 'Your OTP Code for TuneUp Password Reset', // Email subject
    text: `Your one-time password (OTP) is: ${code}\nThis code will expire in 5 minutes.`, // Email body
  };

  // Send the email using the transporter
  await transporter.sendMail(mailOptions);
};

// Export the function so it can be used in other files
module.exports = sendOtp;
