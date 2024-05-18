const CustomError = require('../errors');
const customUtils = require('../utils');

const authenticateUserMiddleware = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }

  try {
    const { userId } = customUtils.isTokenValid(token);
    const testUser = customUtils.checkTestUser(userId);
    req.user = { userId, testUser };
    return next();
  } catch (err) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }
};

module.exports = {
  authenticateUserMiddleware,
};
