const { StatusCodes } = require('http-status-codes');

const prisma = require('../../prisma/prisma-client');

const CustomError = require('../errors');
const customUtils = require('../utils');
const modelMethods = require('../model-methods');

const register = async (req, res) => {
  const verificationCode = customUtils.createRandomOtp();
  console.log({ verificationCode });

  const userModel = new modelMethods.User({
    ...req.body,
    verificationCode: customUtils.hashString(verificationCode),
  });

  await userModel.encryptPassword();

  const user = await prisma.user.create({
    data: userModel.model,
  });

  await customUtils.sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationCode,
  });

  res.status(StatusCodes.CREATED).json({
    msg: `Email verification code sent to ${user.email}`,
  });
};

const verify = async (req, res) => {
  const { email, code } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Verification failed');
  }

  if (user.isVerified) {
    throw new CustomError.BadRequestError('Already verified');
  }

  new modelMethods.User(user).compareVerificationCode(
    customUtils.hashString(code)
  );

  await prisma.user.update({
    data: {
      isVerified: true,
      verified: customUtils.currentTime(),
      verificationCode: null,
    },
    where: {
      email,
    },
  });

  res.status(StatusCodes.OK).json({ msg: 'Email verified successfully' });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new CustomError.NotFoundError(
      `${email} does not exist, please register`
    );
  }

  new modelMethods.User(user).checkPasswordCodeValidity();

  const passwordCode = customUtils.createRandomOtp();
  console.log({ passwordCode });

  const tenMinutes = 1000 * 60 * 10;
  const passwordCodeExpiration = Date.now() + tenMinutes;

  await prisma.user.update({
    data: {
      passwordCode: customUtils.hashString(passwordCode),
      passwordCodeExpiration: customUtils.time(passwordCodeExpiration),
    },
    where: {
      email,
    },
  });

  await customUtils.sendResetPasswordEmail({
    name: user.name,
    email: user.email,
    passwordCode,
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: `Password reset code sent to ${user.email}` });
};

const resetPassword = async (req, res) => {
  const { code, email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Verification failed');
  }

  const userModel = new modelMethods.User({
    ...user,
    password,
  });

  userModel.verifyPasswordCode(customUtils.hashString(code));
  await userModel.encryptPassword();
  await prisma.user.update({
    data: {
      password: userModel.model.password,
      passwordCode: null,
      passwordCodeExpiration: null,
    },
    where: {
      email,
    },
  });

  res.status(StatusCodes.OK).json({ msg: 'Password changed successfully' });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new CustomError.NotFoundError(
      `${email} does not exist, please register`
    );
  }

  const userModel = new modelMethods.User(user);
  userModel.checkAuthorized();
  await userModel.comparePassword(password);
  const tokenUser = customUtils.createTokenUser(user);
  const token = customUtils.getJWTToken(tokenUser);

  res.status(StatusCodes.OK).json({
    name: user.name,
    profileImage: user.profileImage,
    token,
  });
};

module.exports = {
  register,
  verify,
  forgotPassword,
  resetPassword,
  login,
};
