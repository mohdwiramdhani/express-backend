import rateLimit from 'express-rate-limit';

const tooManyRequestsMessage = 'Too many requests, please try again later.';

const rateLimiterHandler = (req, res) => {
    res.status(429).json({
        errors: tooManyRequestsMessage
    });
};

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: rateLimiterHandler,
    headers: true,
});

const registerRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: rateLimiterHandler,
    headers: true,
});

export { loginRateLimiter, registerRateLimiter };