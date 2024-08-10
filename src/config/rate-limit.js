import rateLimit from 'express-rate-limit';

// Ambil nilai dari variabel lingkungan dengan default jika tidak tersedia
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW, 10) * 60 * 1000;
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX, 10);

// Handler untuk rate limiter dengan format pesan `errors`
const createRateLimiterHandler = (message) => (req, res) => {
    res.status(429).json({
        errors: message
    }).end();
};

// Konfigurasi rate limiter
const createRateLimiter = (windowMs, max) => rateLimit({
    windowMs,
    max,
    handler: createRateLimiterHandler('Too many requests, please try again later.'),
    headers: true,
});

// Buat rate limiter untuk login dan register
const loginRateLimiter = createRateLimiter(RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX);
const registerRateLimiter = createRateLimiter(RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX);

export { loginRateLimiter, registerRateLimiter };