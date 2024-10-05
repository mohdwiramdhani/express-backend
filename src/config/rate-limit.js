import rateLimit from 'express-rate-limit';

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW, 10) * 60 * 1000;
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX, 10);

const createRateLimiterHandler = (message) => (req, res) => {
    res.status(429).json({
        errors: message
    }).end();
};

const createRateLimiter = (windowMs, max) => rateLimit({
    windowMs,
    max,
    handler: createRateLimiterHandler('Terlalu banyak permintaan, silakan coba lagi nanti'),
    headers: true,
});

const loginRateLimiter = createRateLimiter(RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX);
const registerRateLimiter = createRateLimiter(RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX);

export { loginRateLimiter, registerRateLimiter };