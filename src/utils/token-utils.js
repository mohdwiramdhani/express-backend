// src/services/tokenService.js
import jwt from "jsonwebtoken";
import getEnvVariable from "../utils/env-utils.js";
import { logger } from "../config/logging.js";

export const generateAccessToken = (userId) => {
    try {
        const secretKey = getEnvVariable('JWT_SECRET_KEY');
        return jwt.sign({ id: userId }, secretKey, { expiresIn: '15m' });
    } catch (error) {
        logger.error(`Error generating access token: ${error.message}`);
        throw error;
    }
};

export const generateRefreshToken = (userId) => {
    try {
        const refreshSecretKey = getEnvVariable('JWT_REFRESH_SECRET_KEY');
        return jwt.sign({ id: userId }, refreshSecretKey, { expiresIn: '1d' });
    } catch (error) {
        logger.error(`Error generating refresh token: ${error.message}`);
        throw error;
    }
};