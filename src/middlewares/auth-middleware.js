import jwt from "jsonwebtoken";
import { prismaClient } from "../config/database.js"; // Pastikan Anda mengimpor prismaClient jika perlu

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({ errors: "Unauthorized" });
        }

        const token = authHeader.replace('Bearer ', '');

        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ errors: "Unauthorized" });
            }

            const userId = decoded.id;

            const user = await prismaClient.user.findUnique({
                where: { id: userId },
                select: { id: true, role: { select: { name: true } } }
            });

            if (!user) {
                return res.status(401).json({ errors: "Unauthorized" });
            }

            req.user = { id: user.id, role: user.role.name };

            if (req.path.startsWith('/users/') && req.method === 'DELETE' && req.user.role !== 'admin') {
                return res.status(403).json({ errors: 'Forbidden' });
            }

            next();
        });
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(500).json({ errors: "Internal Server Error" });
    }
};