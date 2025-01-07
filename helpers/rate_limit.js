const rateLimit = require('express-rate-limit');

// Set up rate limiter for user requests
const createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each user to 5 requests per windowMs
  message: 'Too many requests created from this IP, please try again after 15 minutes',
});

// Set up rate limiter for analytics requests
const analyticsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each user to 10 requests per windowMs
  message: 'Too many analytics requests, please try again after 15 minutes',
});

module.exports = {
  createUrlLimiter,
  analyticsLimiter,
};
