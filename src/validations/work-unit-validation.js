import Joi from "joi";

const createWorkUnitValidation = Joi.object({
    name: Joi.string().max(100).required()
});

const getWorkUnitValidation = Joi.number().positive().required();

const updateWorkUnitValidation = Joi.object({
    name: Joi.string().max(100).required().optional()
});

export {
    createWorkUnitValidation,
    updateWorkUnitValidation,
    getWorkUnitValidation
}