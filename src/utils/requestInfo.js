const getUserAgent = (req) => {
  return req.headers['user-agent'];
};

const getRequestIp = (req) => {
  return req.ip;
};

const checkTestUser = (userId) => {
  const isTestUser = userId === process.env.TEST_USER_ID;

  return isTestUser;
};

module.exports = { getUserAgent, getRequestIp, checkTestUser };
