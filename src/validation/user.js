const Joi = require('joi').extend(require('@joi/date'));

const uploadProfileImageSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

const removeProfileImageSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

const updateUserSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().trim().max(20).min(3).optional(),
    dob: Joi.date().allow(null).optional(),
  });

  req.schema = schema;

  next();
};

const deleteUserSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

module.exports = {
  uploadProfileImageSchema,
  removeProfileImageSchema,
  updateUserSchema,
  deleteUserSchema,
};
