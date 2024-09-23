import Joi from "joi";

const registerMemberValidation = Joi.object({
    fullName: Joi.string().max(255).required(),
    nik: Joi.string().length(16).pattern(/^[0-9]+$/).required(),
    phoneNumber: Joi.string().max(20).allow(null, ''),
    address: Joi.string().allow(null, ''),
    dateOfBirth: Joi.date().allow(null, ''),
    photoUrl: Joi.string().uri().allow(null, ''),
    workUnitId: Joi.number().integer().required()
});

export {
    registerMemberValidation,
}