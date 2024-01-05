const express = require('express');

const {
  getAllCategories,
  getAllContentRatings,
  getAllGenre,
} = require('../controllers/commonController');
const { authenticateUserMiddleware } = require('../middleware/authentication');

const router = express.Router();

router.route('/category').get(authenticateUserMiddleware, getAllCategories);
router
  .route('/content-rating')
  .get(authenticateUserMiddleware, getAllContentRatings);
router.route('/genre').get(authenticateUserMiddleware, getAllGenre);

module.exports = router;
