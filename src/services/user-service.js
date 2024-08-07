import { validate } from "../validations/validation.js";
import { registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation } from "../validations/user-validation.js";
import { prismaClient } from "../config/database.js";
import { ResponseError } from "../errors/response-error.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token-utils.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (countUser > 0) {
        throw new ResponseError(400, "Username already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);

    const adminRoleId = 1;

    const createdUser = await prismaClient.user.create({
        data: {
            username: user.username,
            password: user.password,
            roleId: adminRoleId
        },
        select: {
            username: true,
            role: {
                select: {
                    name: true
                }
            }
        }
    });

    return {
        username: createdUser.username,
        role: createdUser.role.name
    };
}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            id: true,
            username: true,
            password: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "Username or password wrong");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or password wrong");
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return {
        accessToken,
        refreshToken
    };
};

const get = async (id) => {
    id = validate(getUserValidation, id);

    const user = await prismaClient.user.findUnique({
        where: {
            id: id
        },
        select: {
            username: true,
            role: {
                select: {
                    name: true
                }
            }
        }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    return {
        username: user.username,
        role: user.role.name
    };
}

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

    return prismaClient.user.update({
        where: {
            id: user.id
        },
        data: data,
        select: {
            username: true
        }
    });
};

const refreshToken = async (refreshToken) => {
    if (!refreshToken) throw new ResponseError(401, "Refresh token missing");

    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY || 'refresh_secret_key', (err, decoded) => {
            if (err) return reject(new ResponseError(403, "Invalid refresh token"));

            const newAccessToken = generateAccessToken(decoded.id);
            resolve({ accessToken: newAccessToken });
        });
    });
};

export default {
    register,
    login,
    get,
    update,
    refreshToken
}