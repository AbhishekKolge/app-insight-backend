const Joi = require('joi').extend(require('@joi/date'));
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);

const registerSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().trim().max(20).min(3).required(),
    email: Joi.string().trim().email().required(),
    password: joiPassword
      .string()
      .trim()
      .min(8)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfSpecialCharacters(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
  });

  req.schema = schema;

  next();
};

const verifySchema = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    code: Joi.string().trim().required(),
  });

  req.schema = schema;

  next();
};

const forgotPasswordSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
  });

  req.schema = schema;

  next();
};

const resetPasswordSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    code: Joi.string().trim().required(),
    password: joiPassword
      .string()
      .trim()
      .min(8)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfSpecialCharacters(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
  });

  req.schema = schema;

  next();
};

const loginSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: joiPassword
      .string()
      .trim()
      .min(8)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfSpecialCharacters(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
  });

  req.schema = schema;

  next();
};

module.exports = {
  registerSchema,
  verifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  loginSchema,
};
