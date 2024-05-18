const { createJWT, isTokenValid, getJWTToken } = require('./jwt');
const { createTokenUser } = require('./createTokenUser');
const { nodeMailerConfig } = require('./emailConfig');
const { sendEmail } = require('./email');
const {
  sendResetPasswordEmail,
  sendVerificationEmail,
} = require('./sendEmail.js');
const {
  hashString,
  createRandomBytes,
  createRandomOtp,
} = require('./createHash');
const { removeQuotes } = require('./format');
const { currentTime, checkTimeExpired, time } = require('./time');
const { getUserAgent, getRequestIp, checkTestUser } = require('./requestInfo');
const { checkPermissions } = require('./permissions.js');
const { QueryBuilder } = require('./queryBuilder.js');

module.exports = {
  createJWT,
  isTokenValid,
  getJWTToken,
  createTokenUser,
  nodeMailerConfig,
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
  hashString,
  createRandomBytes,
  createRandomOtp,
  getUserAgent,
  getRequestIp,
  checkTestUser,
  removeQuotes,
  currentTime,
  checkTimeExpired,
  time,
  checkPermissions,
  QueryBuilder,
};
