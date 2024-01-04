const CustomError = require('../errors');

const testUserMiddleware = (req, res, next) => {
  //*uncomment it to restrict test user access
  // if (req.user.testUser) {
  //   throw new CustomError.UnauthorizedError('Test user can only read');
  // }
  next();
};

module.exports = { testUserMiddleware };
