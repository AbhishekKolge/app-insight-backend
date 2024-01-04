const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

module.exports = { redisClient };
