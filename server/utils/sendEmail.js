const nodemailer = require('nodemailer');

// Sends email using Gmail SMTP with App Password
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // your Gmail
      pass: process.env.GMAIL_APP_PASSWORD, // your Google App Password
    },
  });

  await transporter.sendMail({
    from: `"TuneUp" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
