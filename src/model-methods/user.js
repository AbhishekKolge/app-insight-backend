const bcrypt = require('bcryptjs');
const validator = require('validator');

const CustomError = require('../errors');
const customUtils = require('../utils');

class User {
  constructor(model) {
    this.model = model;
  }

  compareVerificationCode(code) {
    const isMatch = this.model.verificationCode === code;

    if (!isMatch)
      throw new CustomError.UnauthenticatedError('Verification failed');
  }

  checkPasswordCodeValidity() {
    const isExpired = customUtils.checkTimeExpired(
      this.model.passwordCodeExpiration
    );

    if (!isExpired && this.model.passwordCode) {
      throw new CustomError.ConflictError('Password reset code already sent');
    }
  }

  verifyPasswordCode(passwordCode) {
    if (!this.model.passwordCodeExpiration || !this.model.passwordCode) {
      throw new CustomError.UnauthenticatedError(
        'Please generate forgot password code'
      );
    }
    const isExpired = customUtils.checkTimeExpired(
      this.model.passwordCodeExpiration
    );

    if (isExpired) {
      throw new CustomError.UnauthenticatedError(
        'Password reset code has expired'
      );
    }

    const isMatch = this.model.passwordCode === passwordCode;

    if (!isMatch) {
      throw new CustomError.UnauthenticatedError('Verification failed');
    }
  }

  async comparePassword(password) {
    const isMatch = await bcrypt.compare(password, this.model.password);
    if (!isMatch) {
      throw new CustomError.UnauthenticatedError(
        'Please provide valid credentials'
      );
    }
  }

  async encryptPassword() {
    const isPasswordStrong = validator.isStrongPassword(this.model.password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });

    if (!isPasswordStrong) {
      throw new CustomError.BadRequestError('Please provide strong password');
    }

    const salt = await bcrypt.genSalt(10);
    this.model.password = await bcrypt.hash(this.model.password, salt);

    return this.model;
  }

  checkAuthorized() {
    if (!this.model.isVerified) {
      throw new CustomError.UnauthorizedError('Please verify your email');
    }
  }
}

module.exports = User;
