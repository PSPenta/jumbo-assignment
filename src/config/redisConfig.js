const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379/'
});

redisClient.on('error', (error) => {
  console.error('Redis Connection Error', error);
});

redisClient.on('connect', () => {
  console.info('Redis server connected successfully!');
});

module.exports = redisClient;
