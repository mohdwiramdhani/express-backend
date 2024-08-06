import Joi from "joi";

const registerUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required()
});

const loginUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required()
});

const getUserValidation = Joi.number().positive().required();

const updateUserValidation = Joi.object({
    id: Joi.number().positive().required(),
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).optional(),
})

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation
}