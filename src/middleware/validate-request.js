const { StatusCodes } = require('http-status-codes');

const { removeQuotes } = require('../utils');

const validateRequest = (req, res, next) => {
  const { error } = req.schema.validate(req.body, { abortEarly: false });

  if (error) {
    const { details } = error;
    const errorList = details.map((detail) => {
      return detail.message;
    });
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: removeQuotes(errorList[0]),
    });
  }

  next();
};

module.exports = { validateRequest };
