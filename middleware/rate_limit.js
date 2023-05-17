// Rate limiting middleware to prevent brute force attcks

const rate_limiter = require("express-rate-limiter");

const apiRateLimiter = rate_limiter({
  windowMs: 60 * 1000, // 1 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
  message: "rate limit exceeded",
});

module.exports = apiRateLimiter;
