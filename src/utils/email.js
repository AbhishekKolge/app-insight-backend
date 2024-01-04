const nodemailer = require('nodemailer');

const { nodeMailerConfig } = require('./emailConfig');

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(nodeMailerConfig);

  return transporter.sendMail({
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ID}>`,
    to,
    subject,
    html,
  });
};

module.exports = { sendEmail };
