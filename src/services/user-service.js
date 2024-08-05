import { validate } from "../validations/validation.js";
import { registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation } from "../validations/user-validation.js";
import { prismaClient } from "../config/database.js";
import { ResponseError } from "../errors/response-error.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const existingUser = await prismaClient.user.findFirst({
        where: {
            OR: [
                { username: user.username },
                { email: user.email }
            ]
        }
    });

    if (existingUser) {
        if (existingUser.username === user.username) {
            throw new ResponseError(400, "Username already exists");
        }
        if (existingUser.email === user.email) {
            throw new ResponseError(400, "Email already exists");
        }
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            email: true
        }
    });
}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
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
        token,
        id: user.id
    };
}

export default {
    register,
    login
}