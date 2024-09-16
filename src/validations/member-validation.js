import Joi from "joi";

const registerMemberValidation = Joi.object({
    username: Joi.string().alphanum().min(3).max(100).required(),
    password: Joi.string().min(5).max(100).required()
});

const getMemberValidation = Joi.number().positive().required();

const updateMemberValidation = Joi.object({
    id: Joi.number().positive().required(),
    username: Joi.string().alphanum().min(3).max(100).required(),
    password: Joi.string().min(5).max(100).optional()
})

export {
    registerMemberValidation,
    getMemberValidation,
    updateMemberValidation
}