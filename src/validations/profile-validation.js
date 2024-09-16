import Joi from "joi";

const getProfileValidation = Joi.number().positive().required();

const updateProfileValidation = Joi.object({
    fullName: Joi.string().max(255).allow(null, ''),
    nik: Joi.string().length(16).pattern(/^[0-9]+$/).allow(null, ''),
    phoneNumber: Joi.string().max(20).allow(null, ''),
    address: Joi.string().allow(null, ''),
    dateOfBirth: Joi.date().allow(null, ''),
})

export {
    getProfileValidation,
    updateProfileValidation
}