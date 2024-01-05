const express = require('express');

const {
  showCurrentUser,
  uploadProfileImage,
  removeProfileImage,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { authenticateUserMiddleware } = require('../middleware/authentication');
const {
  uploadProfileImageSchema,
  removeProfileImageSchema,
  updateUserSchema,
  deleteUserSchema,
} = require('../validation/user');
const { validateRequest } = require('../middleware/validate-request');
const { testUserMiddleware } = require('../middleware/test-user');

const router = express.Router();

router.route('/show-me').get(authenticateUserMiddleware, showCurrentUser);
router
  .route('/profile-image')
  .post(
    [authenticateUserMiddleware, uploadProfileImageSchema, validateRequest],
    uploadProfileImage
  )
  .delete(
    [authenticateUserMiddleware, removeProfileImageSchema, validateRequest],
    removeProfileImage
  );
router
  .route('/')
  .patch(
    [authenticateUserMiddleware, updateUserSchema, validateRequest],
    updateUser
  )
  .delete(
    [
      authenticateUserMiddleware,
      testUserMiddleware,
      deleteUserSchema,
      validateRequest,
    ],
    deleteUser
  );

module.exports = router;
