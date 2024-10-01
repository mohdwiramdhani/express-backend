export const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ errors: 'Akses tidak diizinkan' });
    }
    next();
};