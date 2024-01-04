const rateLimiter = require('express-rate-limit');

const rateLimiterSetup = rateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: 'You have exceeded your 30 requests per minute limit.',
  headers: true,
});

module.exports = rateLimiterSetup;
