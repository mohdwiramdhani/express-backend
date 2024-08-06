import { validate } from "../validations/validation.js";
import { registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation } from "../validations/user-validation.js";
import { prismaClient } from "../config/database.js";
import { ResponseError } from "../errors/response-error.js";
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

    const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '10d' });

    return {
        token
    };
}

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

export default {
    register,
    login,
    get
}