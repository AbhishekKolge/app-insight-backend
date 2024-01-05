const { StatusCodes } = require('http-status-codes');

const prisma = require('../../prisma/prisma-client');

const CustomError = require('../errors');
const customUtils = require('../utils');
const retrieveSchema = require('../retrieveSchema');

const getAllReports = async (req, res) => {
  const {
    page,
    sortKey,
    sortMethod,
    nullishSort,
    search,
    genreId,
    contentRatingId,
    categoryId,
    type,
    rating,
    ratingOperator,
    review,
    reviewOperator,
    size,
    sizeOperator,
    installCount,
    installCountOperator,
    price,
    priceOperator,
  } = req.query;

  const queryBuilder = new customUtils.QueryBuilder({
    model: prisma.app,
    searchFields: ['name', 'currentVersion', 'androidVersion'],
    sortKey,
    nullishSort,
  });

  const { results, totalCount, totalPages } = await queryBuilder
    .filter({
      search,
      type,
      rating,
      ratingOperator,
      review,
      reviewOperator,
      size,
      sizeOperator,
      installCount,
      installCountOperator,
      price,
      priceOperator,
    })
    .filterIn({ genreId, contentRatingId, categoryId })
    .sort(sortMethod)
    .paginate(page)
    .selectWithIncludes(retrieveSchema.report)
    .execute();

  res.status(StatusCodes.OK).json({ results, totalCount, totalPages });
};

module.exports = {
  getAllReports,
};
