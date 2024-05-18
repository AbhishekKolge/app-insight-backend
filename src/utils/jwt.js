const jwt = require('jsonwebtoken');

const createJWT = ({
  payload,
  expiresIn = process.env.TOKEN_EXPIRATION_TIME,
}) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: `${expiresIn}ms`,
  });
  return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const getJWTToken = (tokenUser) => {
  const token = createJWT({ payload: tokenUser });
  return token;
};

module.exports = {
  createJWT,
  isTokenValid,
  getJWTToken,
};
