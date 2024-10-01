import Joi from "joi";
import { joiValidation } from "../utils/translate-utils.js";

const registerUserValidation = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(100)
        .required()
        .messages(joiValidation('Username')),
    password: Joi.string()
        .min(5)
        .max(100)
        .required()
        .messages(joiValidation('Password'))
});

const loginUserValidation = Joi.object({
    username: Joi.string()
        .max(100)
        .required()
        .messages(joiValidation('Username')),
    password: Joi.string()
        .max(100)
        .required()
        .messages(joiValidation('Password'))
});

const getUserValidation = Joi.number()
    .positive()
    .required()
    .messages(joiValidation('ID'));

const updateUserValidation = Joi.object({
    id: Joi.number()
        .positive()
        .required()
        .messages(joiValidation('ID')),
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(100)
        .optional()
        .messages(joiValidation('Username')),
    password: Joi.string()
        .min(5)
        .max(100)
        .optional()
        .messages(joiValidation('Password'))
});

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation
};