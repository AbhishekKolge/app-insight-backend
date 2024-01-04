const { StatusCodes } = require('http-status-codes');
const { Prisma } = require('@prisma/client');

const { CustomAPIError } = require('../errors');

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err, err.message);

  const customError = {
    msg: 'Something went wrong, please try again',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err instanceof CustomAPIError) {
    customError.msg = err.message;
    customError.statusCode = err.statusCode;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2000': {
        const key = err.meta.column_name;
        customError.msg = `${key} is too long`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
        break;
      }
      case 'P2001': {
        customError.msg = 'Not found';
        customError.statusCode = StatusCodes.NOT_FOUND;
        break;
      }
      case 'P2002': {
        const key = err.meta.target[0];
        customError.msg = `Provided ${key} already exists`;
        customError.statusCode = StatusCodes.CONFLICT;
        break;
      }
      case 'P2003': {
        const key = err.meta.field_name;
        customError.msg = `${key} does not exist`;
        customError.statusCode = StatusCodes.NOT_FOUND;
        break;
      }
      case 'P2025': {
        customError.msg = 'No record found to delete';
        customError.statusCode = StatusCodes.NOT_FOUND;
        break;
      }
      default: {
        customError.msg = 'Something went wrong, please try again';
        customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      }
    }
  }

  res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
