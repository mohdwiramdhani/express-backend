import { validate } from "../validations/validation.js";
import { registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation } from "../validations/user-validation.js";
import { prismaClient } from "../config/database.js";
import { ResponseError } from "../errors/response-error.js";
import token from "../utils/token-utils.js";
import bcrypt from "bcrypt";
import { formatTimezone } from "../helpers/date-helper.js";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: { username: user.username }
    });

    if (countUser > 0) {
        throw new ResponseError(400, "Username sudah digunakan");
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
        throw new ResponseError(400, "Username sudah digunakan");
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
        throw new ResponseError(401, "Username atau password salah");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username atau password salah");
    }

    const accessToken = token.generateAccessToken(user.id, user.role.name);
    // const refreshToken = token.generateRefreshToken(user.id, user.role.name);

    return {
        accessToken,
        // refreshToken,
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
        throw new ResponseError(404, "Pengguna tidak ditemukan");
    }

    user.role = user.role.name
    user.createdAt = formatTimezone(user.createdAt);
    user.updatedAt = formatTimezone(user.updatedAt);

    return user;
};

const getAll = async () => {
    const users = await prismaClient.user.findMany({
        select: {
            id: true,
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

    return users.map(user => ({
        id: user.id,
        username: user.username,
        role: user.role.name,
        createdAt: formatTimezone(user.createdAt),
        updatedAt: formatTimezone(user.updatedAt)
    }));
};

const update = async (request) => {
    const user = validate(updateUserValidation, request);

    const existingUser = await prismaClient.user.findUnique({
        where: {
            id: user.id
        }
    });

    if (!existingUser) {
        throw new ResponseError(404, "Pengguna tidak ditemukan");
    }

    const data = {};

    if (user.username) {
        const usernameExists = await prismaClient.user.findUnique({
            where: {
                username: user.username
            }
        });

        if (usernameExists && usernameExists.id !== existingUser.id) {
            throw new ResponseError(400, "Username sudah digunakan");
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


// export const refreshToken = async (refreshToken) => {
//     if (!refreshToken) {
//         throw new ResponseError(401, "Refresh token missing");
//     }

//     try {
//         const decoded = await new Promise((resolve, reject) => {
//             jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (err, decoded) => {
//                 if (err) return reject(err);
//                 resolve(decoded);
//             });
//         });

//         const newAccessToken = token.generateAccessToken(decoded.id, decoded.role);
//         const newRefreshToken = token.generateRefreshToken(decoded.id, decoded.role);

//         return { accessToken: newAccessToken, refreshToken: newRefreshToken };
//     } catch (err) {
//         throw new ResponseError(403, "Invalid refresh token");
//     }
// };

const removeStaff = async (id) => {
    id = validate(getUserValidation, id);

    const existingUser = await prismaClient.user.findUnique({
        where: {
            id: id
        }
    });

    if (!existingUser) {
        throw new ResponseError(404, "Pengguna tidak ditemukan");
    }

    if (existingUser.roleId === 1) {
        throw new ResponseError(403, "Pengguna dengan peran admin tidak dapat dihapus");
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
    getAll,
    update,
    // refreshToken,
    removeStaff
};