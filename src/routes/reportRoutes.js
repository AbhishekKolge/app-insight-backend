const express = require('express');

const { getAllReports } = require('../controllers/reportController');
const { authenticateUserMiddleware } = require('../middleware/authentication');

const router = express.Router();

router.route('/').get(authenticateUserMiddleware, getAllReports);

module.exports = router;
