import Joi from "joi";
import { joiValidation } from "../utils/translate-utils.js";

const createWorkUnitValidation = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages(joiValidation('Nama unit kerja'))
});

const getWorkUnitValidation = Joi.number()
    .positive()
    .required()
    .messages(joiValidation('ID unit kerja'));

const updateWorkUnitValidation = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages(joiValidation('Nama unit kerja'))
});

export {
    createWorkUnitValidation,
    updateWorkUnitValidation,
    getWorkUnitValidation
};