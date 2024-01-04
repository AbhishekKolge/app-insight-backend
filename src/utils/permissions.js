const CustomError = require('../errors');

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError('Not authorized');
};

module.exports = { checkPermissions };
