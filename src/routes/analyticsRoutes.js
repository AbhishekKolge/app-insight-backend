const express = require('express');

const {
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
} = require('../controllers/analyticsController');
const { authenticateUserMiddleware } = require('../middleware/authentication');

const router = express.Router();

router.route('/overview').get(authenticateUserMiddleware, getOverview);
router
  .route('/categories/average-rating')
  .get(authenticateUserMiddleware, getCategoryAverageRating);
router
  .route('/categories/rating-type')
  .get(authenticateUserMiddleware, getRatingByTypeAndCategory);
router
  .route('/categories/top-download')
  .get(authenticateUserMiddleware, getCategoryTopDownloads);
router
  .route('/apps/top-rating')
  .get(authenticateUserMiddleware, getTopAppsRating);
router
  .route('/apps/top-expensive')
  .get(authenticateUserMiddleware, getTopExpensiveApps);
router
  .route('/apps/top-reviewed')
  .get(authenticateUserMiddleware, getTopReviewedApp);
router
  .route('/apps/top-commented')
  .get(authenticateUserMiddleware, getTopCommentedApps);
router
  .route('/apps/free-paid')
  .get(authenticateUserMiddleware, getFreePaidCount);
router
  .route('/apps/content-rating')
  .get(authenticateUserMiddleware, getContentRatingAppCount);

module.exports = router;
