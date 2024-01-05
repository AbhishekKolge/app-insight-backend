const CustomError = require('../errors');

const testUserMiddleware = (req, res, next) => {
  if (req.user.testUser) {
    throw new CustomError.UnauthorizedError(
      "Test user can't perform this action"
    );
  }
  next();
};

module.exports = { testUserMiddleware };
