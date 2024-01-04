const { sendEmail } = require('./email');

const sendResetPasswordEmail = async ({ name, email, passwordCode }) => {
  const message = `<p>Your password reset code is ${passwordCode}</p>`;

  const html = `<h4>Hello, ${name}</h4> ${message}`;

  return sendEmail({
    to: email,
    subject: `${process.env.APP_NAME.split(' ').join('-')} Reset Password Code`,
    html,
  });
};

const sendVerificationEmail = async ({ name, email, verificationCode }) => {
  const message = `<p>Your email verification code is ${verificationCode}</p>`;

  const html = `<h4>Hello, ${name}</h4> ${message}`;

  return sendEmail({
    to: email,
    subject: `${process.env.APP_NAME.split(' ').join(
      '-'
    )} Email Confirmation Code`,
    html,
  });
};

module.exports = { sendResetPasswordEmail, sendVerificationEmail };
