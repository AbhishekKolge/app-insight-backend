const BadRequestError = require('./bad-request');
const CustomAPIError = require('./custom-api');
const NotFoundError = require('./not-found');
const UnauthenticatedError = require('./unauthenticated');
const UnauthorizedError = require('./unauthorized');
const ConflictError = require('./conflict');

module.exports = {
  BadRequestError,
  CustomAPIError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
  ConflictError,
};
