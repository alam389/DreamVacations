const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, 
  port: process.env.SMTP_PORT, 
  secure: process.env.SMTP_SECURE === 'true', 
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
  debug: true,  // Enables detailed debug output
  logger: true, // Enables logging
});

// Verify the transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer transporter configuration error:', error);
  } else {
    console.log('Nodemailer transporter is ready to send emails');
  }
});

const sendAuthEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"Bucketlist" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
};

module.exports = { transporter, sendAuthEmail };