import jwt from "jsonwebtoken";
import getEnvVariable from "../utils/env-utils.js";
import { logger } from "../config/logging.js";

const generateAccessToken = (userId, role) => {
    try {
        const secretKey = getEnvVariable('JWT_SECRET_KEY');
        const expiresIn = getEnvVariable('ACCESS_TOKEN_EXPIRATION');
        return jwt.sign({ id: userId, role: role }, secretKey, { expiresIn });
    } catch (error) {
        logger.error(`Error generating access token: ${error.message}`);
        throw error;
    }
};

// const generateRefreshToken = (userId, role) => {
//     try {
//         const refreshSecretKey = getEnvVariable('JWT_REFRESH_SECRET_KEY');
//         const expiresIn = getEnvVariable('REFRESH_TOKEN_EXPIRATION');
//         return jwt.sign({ id: userId, role: role }, refreshSecretKey, { expiresIn });
//     } catch (error) {
//         logger.error(`Error generating refresh token: ${error.message}`);
//         throw error;
//     }
// };

export default {
    generateAccessToken,
    // generateRefreshToken
};