const { StatusCodes } = require('http-status-codes');

const prisma = require('../../prisma/prisma-client');

const CustomError = require('../errors');
const customUtils = require('../utils');
const retrieveSchema = require('../retrieveSchema');

const getAllReports = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};

module.exports = {
  getAllReports,
};
