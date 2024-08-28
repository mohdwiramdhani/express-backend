import { validate } from "../validations/validation.js";
import { registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation } from "../validations/user-validation.js";
import { prismaClient } from "../config/database.js";
import { ResponseError } from "../errors/response-error.js";
import token from "../utils/token-utils.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import moment from 'moment-timezone';

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: { username: user.username }
    });

    if (countUser > 0) {
        throw new ResponseError(400, "Username already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);
    user.roleId = 1;

    const newUser = await prismaClient.user.create({
        data: user
    });

    await prismaClient.profile.create({
        data: {
            ...request.profile,
            userId: newUser.id
        }
    });
};

const registerStaff = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: { username: user.username }
    });

    if (countUser > 0) {
        throw new ResponseError(400, "Username already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);
    user.roleId = 2;

    const newUser = await prismaClient.user.create({
        data: user
    });

    await prismaClient.profile.create({
        data: {
            ...request.profile,
            userId: newUser.id
        }
    });
};

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            id: true,
            username: true,
            password: true,
            role: {
                select: {
                    name: true
                }
            }
        }
    });

    if (!user) {
        throw new ResponseError(401, "Username or password is incorrect");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or password is incorrect");
    }

    const accessToken = token.generateAccessToken(user.id, user.role.name);
    const refreshToken = token.generateRefreshToken(user.id, user.role.name);

    return {
        accessToken,
        refreshToken,
        role: user.role.name
    };
};

const get = async (id) => {
    id = validate(getUserValidation, id);

    const user = await prismaClient.user.findUnique({
        where: { id },
        select: {
            username: true,
            role: {
                select: {
                    name: true
                }
            },
            createdAt: true,
            updatedAt: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    const timezone = 'Asia/Singapore';
    user.role = user.role.name
    user.createdAt = moment(user.createdAt).tz(timezone).format();
    user.updatedAt = moment(user.updatedAt).tz(timezone).format();

    return user;
};

const update = async (request) => {
    const user = validate(updateUserValidation, request);

    const existingUser = await prismaClient.user.findUnique({
        where: {
            id: user.id
        }
    });

    if (!existingUser) {
        throw new ResponseError(404, "User not found");
    }

    const data = {};

    if (user.username) {
        const usernameExists = await prismaClient.user.findUnique({
            where: {
                username: user.username
            }
        });

        if (usernameExists && usernameExists.id !== existingUser.id) {
            throw new ResponseError(400, "Username already exists");
        }

        data.username = user.username;
    }

    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }

    await prismaClient.user.update({
        where: { id: user.id },
        data
    });
};

export const refreshToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new ResponseError(401, "Refresh token missing");
    }

    try {
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (err, decoded) => {
                if (err) return reject(err);
                resolve(decoded);
            });
        });

        const newAccessToken = token.generateAccessToken(decoded.id, decoded.role);
        const newRefreshToken = token.generateRefreshToken(decoded.id, decoded.role);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
        throw new ResponseError(403, "Invalid refresh token");
    }
};

const deleteStaff = async (id) => {
    id = validate(getUserValidation, id);

    const existingUser = await prismaClient.user.findUnique({
        where: {
            id: id
        }
    });

    if (!existingUser) {
        throw new ResponseError(404, "User not found");
    }

    if (existingUser.roleId === 1) {
        throw new ResponseError(403, "Cannot delete admin user");
    }

    await prismaClient.user.delete({
        where: {
            id: id
        }
    });
};

export default {
    register,
    registerStaff,
    login,
    get,
    update,
    refreshToken,
    deleteStaff
};