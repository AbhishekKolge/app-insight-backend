const express = require('express');

const {
  register,
  verify,
  forgotPassword,
  resetPassword,
  login,
} = require('../controllers/authController');
const {
  registerSchema,
  verifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  loginSchema,
} = require('../validation/auth');
const { validateRequest } = require('../middleware/validate-request');

const router = express.Router();

router.route('/register').post([registerSchema, validateRequest], register);
router.route('/verify').post([verifySchema, validateRequest], verify);
router
  .route('/forgot-password')
  .post([forgotPasswordSchema, validateRequest], forgotPassword);
router
  .route('/reset-password')
  .post([resetPasswordSchema, validateRequest], resetPassword);
router.route('/login').post([loginSchema, validateRequest], login);

module.exports = router;
