const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

class QueryBuilder {
  constructor({ model, searchFields, sortKey }) {
    this.model = model;
    this.query = {
      where: {},
    };
    this.pagination = {};
    this.searchFields = searchFields || [];
    this.sortKey = sortKey || '';
    this.selectFields = [];
    this.includeRelations = [];
    this.selectIncludes = {};
  }

  filter(filterObject) {
    if (filterObject.search) {
      const searchFilters = this.searchFields.map((field) => ({
        [field]: {
          contains: filterObject.search.trim(),
          mode: 'insensitive',
        },
      }));
      this.query.where.OR = searchFilters;
      delete filterObject.search;
    }

    if (filterObject.rating) {
      const { rating, ratingOperator } = filterObject;
      if (+rating && ratingOperator) {
        this.query.where.rating = {
          [ratingOperator]: +rating,
        };
      }
    }

    if (filterObject.review) {
      const { review, reviewOperator } = filterObject;
      if (+review && reviewOperator) {
        this.query.where.reviewCount = {
          [reviewOperator]: +review,
        };
      }
    }

    if (filterObject.size) {
      const { size, sizeOperator } = filterObject;
      if (+size && sizeOperator) {
        this.query.where.size = {
          [sizeOperator]: +size,
        };
      }
    }

    if (filterObject.installCount) {
      const { installCount, installCountOperator } = filterObject;
      if (+installCount && installCountOperator) {
        this.query.where.installCount = {
          [installCountOperator]: +installCount,
        };
      }
    }

    if (filterObject.price) {
      const { price, priceOperator } = filterObject;
      if (+price && priceOperator) {
        this.query.where.price = {
          [priceOperator]: +price,
        };
      }
    }

    delete filterObject.rating;
    delete filterObject.ratingOperator;
    delete filterObject.review;
    delete filterObject.reviewOperator;
    delete filterObject.size;
    delete filterObject.sizeOperator;
    delete filterObject.installCount;
    delete filterObject.installCountOperator;
    delete filterObject.price;
    delete filterObject.priceOperator;

    this.query.where = {
      ...this.query.where,
      ...filterObject,
    };

    return this;
  }

  sort(sortOption) {
    const sortOptions = {
      latest: { [this.sortKey]: { sort: 'desc', nulls: 'last' } },
      oldest: { [this.sortKey]: { sort: 'asc', nulls: 'last' } },
      highest: { [this.sortKey]: { sort: 'desc', nulls: 'last' } },
      lowest: { [this.sortKey]: { sort: 'asc', nulls: 'last' } },
      aToZ: { [this.sortKey]: { sort: 'asc', nulls: 'last' } },
      zToA: { [this.sortKey]: { sort: 'desc', nulls: 'last' } },
    };

    this.query.orderBy = sortOptions[sortOption] || { createdAt: 'desc' };

    return this;
  }

  paginate(pageNumber = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE) {
    this.pagination = {
      skip: Math.max(0, (pageNumber - 1) * pageSize),
      take: Math.max(1, pageSize),
    };
    return this;
  }

  select(fields) {
    this.selectFields = fields;
    return this;
  }

  include(relations) {
    this.includeRelations = relations;
    return this;
  }

  selectWithIncludes(nestedFields) {
    this.selectIncludes = nestedFields;
    return this;
  }

  generateSelectObject() {
    if (this.selectFields.length) {
      return this.selectFields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});
    }
    return undefined;
  }

  generateIncludeObject() {
    if (this.includeRelations.length) {
      return this.includeRelations.reduce((acc, relation) => {
        acc[relation] = true;
        return acc;
      }, {});
    }
    return undefined;
  }

  async execute() {
    const { skip, take } = this.pagination;

    const query = {
      where: this.query.where,
      orderBy: this.query.orderBy,
      skip,
      take,
      select: this.generateSelectObject() || this.selectIncludes,
      include: this.generateIncludeObject(),
    };

    const [results, totalCount] = await Promise.all([
      this.model.findMany(query),
      this.model.count({ where: this.query.where }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    return { results, totalCount, totalPages };
  }
}

module.exports = { QueryBuilder };
