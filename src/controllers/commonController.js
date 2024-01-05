const { StatusCodes } = require('http-status-codes');

const prisma = require('../../prisma/prisma-client');

const CustomError = require('../errors');
const customUtils = require('../utils');
const retrieveSchema = require('../retrieveSchema');

const getAllCategories = async (req, res) => {
  const { page, search } = req.query;

  const queryBuilder = new customUtils.QueryBuilder({
    model: prisma.category,
    searchFields: ['name'],
  });

  const { results, totalCount, totalPages } = await queryBuilder
    .filter({
      search,
    })
    .paginate(page)
    .select(['id', 'name'])
    .execute();

  res.status(StatusCodes.OK).json({ results, totalCount, totalPages });
};

const getAllContentRatings = async (req, res) => {
  const { page, search } = req.query;

  const queryBuilder = new customUtils.QueryBuilder({
    model: prisma.contentRating,
    searchFields: ['name'],
  });

  const { results, totalCount, totalPages } = await queryBuilder
    .filter({
      search,
    })
    .paginate(page)
    .select(['id', 'name'])
    .execute();

  res.status(StatusCodes.OK).json({ results, totalCount, totalPages });
};

const getAllGenre = async (req, res) => {
  const { page, search } = req.query;

  const queryBuilder = new customUtils.QueryBuilder({
    model: prisma.genre,
    searchFields: ['name'],
  });

  const { results, totalCount, totalPages } = await queryBuilder
    .filter({
      search,
    })
    .paginate(page)
    .select(['id', 'name'])
    .execute();

  res.status(StatusCodes.OK).json({ results, totalCount, totalPages });
};

module.exports = {
  getAllCategories,
  getAllContentRatings,
  getAllGenre,
};
