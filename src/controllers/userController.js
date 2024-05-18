const { StatusCodes } = require('http-status-codes');
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;

const prisma = require('../../prisma/prisma-client');

const CustomError = require('../errors');
const retrieveSchema = require('../retrieveSchema');

const showCurrentUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
    select: retrieveSchema.user,
  });

  res.status(StatusCodes.OK).json({ user });
};

const uploadProfileImage = async (req, res) => {
  const { userId } = req.user;

  if (!req.files || !req.files.profileImage) {
    throw new CustomError.BadRequestError('No file attached');
  }

  const { profileImage } = req.files;

  try {
    if (!profileImage.mimetype.startsWith('image')) {
      throw new CustomError.BadRequestError('Please upload an image');
    }

    const maxSize = 1024 * 1024;

    if (profileImage.size >= maxSize) {
      throw new CustomError.BadRequestError(
        'Please upload an image smaller than 1 MB'
      );
    }

    const result = await cloudinary.uploader.upload(profileImage.tempFilePath, {
      use_filename: true,
      folder: `${process.env.APP_NAME.split(' ').join('-')}/profile-images`,
    });

    await fs.unlink(profileImage.tempFilePath);

    const { profileImageId: oldProfileImageId } = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    await prisma.user.update({
      data: {
        profileImage: result.secure_url,
        profileImageId: result.public_id,
      },
      where: {
        id: userId,
      },
    });

    if (oldProfileImageId) {
      await cloudinary.uploader.destroy(oldProfileImageId);
    }

    res.status(StatusCodes.OK).json({
      profileImage: result.secure_url,
    });
  } catch (error) {
    await fs.unlink(profileImage.tempFilePath);
    throw error;
  }
};

const removeProfileImage = async (req, res) => {
  const {
    query: { profileImageId },
    user: { userId },
  } = req;

  if (!profileImageId) {
    throw new CustomError.BadRequestError('Please provide profile image id');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user.profileImageId) {
    throw new CustomError.NotFoundError(
      `No file found with id of ${profileImageId}`
    );
  }

  if (user.profileImageId !== profileImageId) {
    throw new CustomError.BadRequestError('Please provide valid image id');
  }

  await prisma.user.update({
    data: { profileImage: null, profileImageId: null },
    where: {
      id: userId,
    },
  });

  await cloudinary.uploader.destroy(profileImageId);

  res.status(StatusCodes.OK).json({
    msg: 'Profile image removed successfully',
  });
};

const updateUser = async (req, res) => {
  const { userId } = req.user;

  await prisma.user.update({
    data: req.body,
    where: {
      id: userId,
    },
  });

  res.status(StatusCodes.OK).json({
    msg: 'Profile updated successfully',
  });
};

const deleteUser = async (req, res) => {
  const { userId } = req.user;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new CustomError.NotFoundError(`No user found with id of ${userId}`);
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  if (user.profileImageId) {
    await cloudinary.uploader.destroy(user.profileImageId);
  }

  res.status(StatusCodes.OK).json({
    msg: 'Account deleted successfully',
  });
};

module.exports = {
  showCurrentUser,
  uploadProfileImage,
  removeProfileImage,
  updateUser,
  deleteUser,
};
