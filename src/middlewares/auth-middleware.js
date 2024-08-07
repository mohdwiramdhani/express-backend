import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({ errors: "Unauthorized" });
        }

        const token = authHeader.replace('Bearer ', '');

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ errors: "Unauthorized" });
            }

            req.user = { id: decoded.id };
            next();
        });
    } catch (error) {
        return res.status(500).json({ errors: "Internal Server Error" });
    }
};