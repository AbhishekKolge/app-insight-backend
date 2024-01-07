const { StatusCodes } = require('http-status-codes');

const prisma = require('../../prisma/prisma-client');

const customUtils = require('../utils');
const retrieveSchema = require('../retrieveSchema');

const getOverview = async (req, res) => {
  const [
    totalCategory,
    totalContentRating,
    totalGenre,
    totalReview,
    totalApps,
    {
      _sum: { installCount },
      _avg: { rating: avgRating },
      _avg: { size: avgSize },
    },
  ] = await Promise.all([
    prisma.category.count(),
    prisma.contentRating.count(),
    prisma.genre.count(),
    prisma.review.count(),
    prisma.app.count(),
    prisma.app.aggregate({
      _sum: { installCount: true },
      _avg: { rating: true, size: true },
    }),
  ]);

  res.status(StatusCodes.OK).json({
    totalCategory,
    totalContentRating,
    totalGenre,
    totalReview,
    totalApps,
    installCount,
    avgRating,
    avgSize,
  });
};

const getCategoryAverageRating = async (req, res) => {
  const { categoryId, rating, ratingOperator } = req.query;

  const queryBuilder = new customUtils.QueryBuilder({
    model: prisma.app,
  });

  const groupData = await queryBuilder
    .filterIn({ categoryId })
    .filter({
      rating,
      ratingOperator,
    })
    .avg(['rating'])
    .executeGroupBy(['categoryId']);

  const categoryIds = groupData.map((entry) => entry.categoryId);

  const categoryQueryBuilder = new customUtils.QueryBuilder({
    model: prisma.category,
  });

  const { results: categoryList } = await categoryQueryBuilder
    .filterIn({ id: categoryIds.join(',') })
    .select(['name', 'id'])
    .execute();

  const results = groupData.map((entry) => ({
    categoryId: entry.categoryId,
    category: categoryList.find((category) => category.id === entry.categoryId)
      .name,
    avgRating: +entry._avg.rating.toFixed(2),
  }));

  res.status(StatusCodes.OK).json(results);
};

const getCategoryTopDownloads = async (req, res) => {
  const { sortMethod, categoryId, installCount, installCountOperator } =
    req.query;

  const { results: categories } = await new customUtils.QueryBuilder({
    model: prisma.category,
  })
    .filterIn({ id: categoryId })
    .select(['id', 'name'])
    .execute();

  let topApps = [];

  for (const category of categories) {
    const { results } = await new customUtils.QueryBuilder({
      model: prisma.app,
      sortKey: 'installCount',
    })
      .filter({ categoryId: category.id, installCount, installCountOperator })
      .sort('highest')
      .paginate(1, 1)
      .selectWithIncludes(retrieveSchema.topAppsByCategory)
      .execute();

    topApps.push(...results);
  }

  topApps = topApps.map((app) => {
    return {
      ...app,
      category: app.category.name,
    };
  });

  if (sortMethod === 'highest') {
    topApps.sort((a, b) => b.installCount - a.installCount);
  } else if (sortMethod === 'lowest') {
    topApps.sort((a, b) => a.installCount - b.installCount);
  }

  res.status(StatusCodes.OK).json(topApps);
};

const getTopAppsRating = async (req, res) => {
  const { categoryId, type, contentRatingId } = req.query;

  const { results } = await new customUtils.QueryBuilder({
    model: prisma.app,
    sortKey: 'installCount',
  })
    .filterIn({ categoryId, type, contentRatingId })
    .sort('highest')
    .paginate(1, 10)
    .selectWithIncludes(retrieveSchema.topAppsByRating)
    .execute();

  res.status(StatusCodes.OK).json(results);
};

const getTopExpensiveApps = async (req, res) => {
  const { categoryId, contentRatingId, genreId, price, priceOperator } =
    req.query;

  const { results: categories } = await new customUtils.QueryBuilder({
    model: prisma.category,
  })
    .filterIn({ id: categoryId })
    .select(['id', 'name'])
    .execute();

  let topApps = [];

  for (const category of categories) {
    const { results } = await new customUtils.QueryBuilder({
      model: prisma.app,
      sortKey: 'price',
    })
      .filter({
        categoryId: category.id,
        type: 'PAID',
      })
      .filterIn({
        price,
        priceOperator,
        contentRatingId,
        genreId,
      })
      .sort('highest')
      .paginate(1, 1)
      .selectWithIncludes(retrieveSchema.topExpensiveApps)
      .execute();

    topApps.push(...results);
  }

  topApps = topApps.map((app) => {
    return {
      ...app,
      category: app.category.name,
    };
  });

  res.status(StatusCodes.OK).json(topApps);
};

const getTopReviewedApp = async (req, res) => {
  const {
    sortMethod,
    genreId,
    contentRatingId,
    categoryId,
    type,
    rating,
    ratingOperator,
    size,
    sizeOperator,
    installCount,
    installCountOperator,
    price,
    priceOperator,
  } = req.query;

  const queryBuilder = new customUtils.QueryBuilder({
    model: prisma.app,
    sortKey: 'reviewCount',
  });

  const { results } = await queryBuilder
    .filter({
      rating,
      ratingOperator,
      size,
      sizeOperator,
      installCount,
      installCountOperator,
      price,
      priceOperator,
    })
    .filterIn({ type, genreId, contentRatingId, categoryId })
    .sort(sortMethod)
    .paginate()
    .selectWithIncludes(retrieveSchema.topReviewedApps)
    .execute();

  res.status(StatusCodes.OK).json(results);
};

const getTopCommentedApps = async (req, res) => {
  const {
    genreId,
    contentRatingId,
    categoryId,
    type,
    rating,
    ratingOperator,
    size,
    sizeOperator,
    installCount,
    installCountOperator,
    price,
    priceOperator,
  } = req.query;

  const queryBuilder = new customUtils.QueryBuilder({
    model: prisma.app,
  });

  const { results } = await queryBuilder
    .filter({
      rating,
      ratingOperator,
      size,
      sizeOperator,
      installCount,
      installCountOperator,
      price,
      priceOperator,
    })
    .filterIn({ type, genreId, contentRatingId, categoryId })
    .sortNested({
      reviews: {
        _count: 'desc',
      },
    })
    .paginate()
    .selectWithIncludes(retrieveSchema.topCommentedApps)
    .execute();

  const appsWithSentimentPercentage = results.map((app) => {
    const actualCommentCount = app.reviews.length;
    const sentimentCounts = app.reviews.reduce(
      (acc, review) => {
        acc[review.sentiment]++;
        return acc;
      },
      { POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0 }
    );

    const positivePercentage = +(
      (sentimentCounts.POSITIVE / actualCommentCount) *
      100
    ).toFixed(2);
    const negativePercentage = +(
      (sentimentCounts.NEGATIVE / actualCommentCount) *
      100
    ).toFixed(2);
    const neutralPercentage = +(
      (sentimentCounts.NEUTRAL / actualCommentCount) *
      100
    ).toFixed(2);

    return {
      name: app.name,
      actualCommentCount,
      positivePercentage,
      negativePercentage,
      neutralPercentage,
    };
  });

  res.status(StatusCodes.OK).json(appsWithSentimentPercentage);
};

const getRatingByTypeAndCategory = async (req, res) => {
  const { categoryId, rating, ratingOperator } = req.query;

  const queryBuilder = new customUtils.QueryBuilder({
    model: prisma.app,
  });

  const categoryGroupData = await queryBuilder
    .filterIn({ categoryId })
    .filter({
      rating,
      ratingOperator,
    })
    .avg(['rating'])
    .executeGroupBy(['categoryId', 'type']);

  const categoryIds = categoryGroupData.map((entry) => entry.categoryId);

  const categoryQueryBuilder = new customUtils.QueryBuilder({
    model: prisma.category,
  });

  const { results: categoryList } = await categoryQueryBuilder
    .filterIn({ id: categoryIds.join(',') })
    .select(['name', 'id'])
    .execute();

  const results = categoryGroupData.map((entry) => {
    const categoryName = categoryList.find(
      (category) => category.id === entry.categoryId
    ).name;
    return {
      type: entry.type,
      [categoryName]: +entry._avg.rating?.toFixed(2),
    };
  });

  const categoryTypeGroupedData = results.reduce((acc, entry) => {
    const type = entry.type;
    if (!acc[type]) {
      acc[type] = { ...entry };
    } else {
      acc[type] = { ...acc[type], ...entry };
    }
    return acc;
  }, {});

  const resultArray = Object.values(categoryTypeGroupedData);

  res
    .status(StatusCodes.OK)
    .json({ categories: categoryList, results: resultArray });
};

const getFreePaidCount = async (req, res) => {
  const {
    categoryId,
    contentRatingId,
    genreId,
    rating,
    ratingOperator,
    installCount,
    installCountOperator,
  } = req.query;

  const queryBuilder = new customUtils.QueryBuilder({
    model: prisma.app,
  });

  const groupData = await queryBuilder
    .filterIn({ genreId, contentRatingId, categoryId })
    .filter({
      rating,
      ratingOperator,
      installCount,
      installCountOperator,
    })
    .count('_all')
    .executeGroupBy(['type']);

  const results = groupData.map((item) => {
    return {
      count: item._count._all,
      type: item.type,
    };
  });

  res.status(StatusCodes.OK).json(results);
};

const getContentRatingAppCount = async (req, res) => {
  const {
    categoryId,
    contentRatingId,
    genreId,
    rating,
    ratingOperator,
    installCount,
    installCountOperator,
    type,
  } = req.query;

  const queryBuilder = new customUtils.QueryBuilder({
    model: prisma.app,
  });

  const groupData = await queryBuilder
    .filterIn({ genreId, contentRatingId, categoryId, type })
    .filter({
      rating,
      ratingOperator,
      installCount,
      installCountOperator,
    })
    .count('_all')
    .executeGroupBy(['contentRatingId']);

  const contentRatingIds = groupData.map((entry) => entry.contentRatingId);

  const categoryQueryBuilder = new customUtils.QueryBuilder({
    model: prisma.contentRating,
  });

  const { results: contentRatingList } = await categoryQueryBuilder
    .filterIn({ id: contentRatingIds.join(',') })
    .select(['name', 'id'])
    .execute();

  const results = groupData.map((entry) => ({
    contentRatingId: entry.contentRatingId,
    contentRating: contentRatingList.find(
      (contentRating) => contentRating.id === entry.contentRatingId
    ).name,
    count: entry._count._all,
  }));

  res.status(StatusCodes.OK).json(results);
};

module.exports = {
  getOverview,
  getCategoryAverageRating,
  getCategoryTopDownloads,
  getTopAppsRating,
  getTopExpensiveApps,
  getTopReviewedApp,
  getTopCommentedApps,
  getRatingByTypeAndCategory,
  getFreePaidCount,
  getContentRatingAppCount,
};
