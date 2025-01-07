// const redis = require('redis');

// const redisClient = redis.createClient({
//     url: process.env.REDIS_URL,
// });

// redisClient.on('connect', () => console.log('Connected to Redis'));
// redisClient.on('error', (err) => console.error('Redis error:', err));

// module.exports = redisClient;


// Import the required package
const { createClient } = require('@redis/client');

// Create Redis client instance
// const redisClient = createClient({
//     url: process.env.REDIS_URL || 'redis://localhost:6379',
// });

const redisClient = createClient({
    username: process.env.REDIS_USERNAME, // Load username from .env
    password: process.env.REDIS_PASSWORD, // Load password from .env
    socket: {
      host: process.env.REDIS_HOST,       
      port: process.env.REDIS_PORT,     
    },
});


// Connect to Redis
async function connectRedis() {
    try {
        await redisClient.connect(); // Connect to Redis asynchronously
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Redis connection error:', err);
    }
}

// Handle Redis errors
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

connectRedis()
// Export the redisClient instance
module.exports = { redisClient, connectRedis };

