import Joi from "joi";

const getProfileValidation = Joi.number().positive().required();

const updateProfileValidation = Joi.object({
    fullName: Joi.string().max(255).optional(),
    nik: Joi.string().length(16).pattern(/^[0-9]+$/).optional(),
    phoneNumber: Joi.string().max(20).optional(),
    address: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
})

export {
    getProfileValidation,
    updateProfileValidation
}