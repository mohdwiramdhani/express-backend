import Joi from "joi";

const createProfileValidation = Joi.object({
    fullName: Joi.string().max(255).required(),
    nik: Joi.string().length(16).optional(),
    phoneNumber: Joi.string().max(20).optional(),
    address: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
});

const getProfileValidation = Joi.number().positive().required();

const updateProfileValidation = Joi.object({
    fullName: Joi.string().max(255).optional(),
    nik: Joi.string().length(16).optional(),
    phoneNumber: Joi.string().max(20).optional(),
    address: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
})

export {
    createProfileValidation,
    getProfileValidation,
    updateProfileValidation
}