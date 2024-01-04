const { redisClient } = require('../db/connect');

const EXPIRATION_TIME = 3600;

const cache = async (key, cb) => {
  const oldData = await redisClient.get(key);

  if (oldData !== null) {
    return JSON.parse(oldData);
  }

  const newData = await cb();
  await redisClient.setEx(key, EXPIRATION_TIME, JSON.stringify(newData));
  return newData;
};

module.exports = cache;
