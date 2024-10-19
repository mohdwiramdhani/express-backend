import Joi from "joi";
import { joiValidation } from "../utils/translate-utils.js";

const createMemberSavingValidation = Joi.object({
    year: Joi.number()
        .integer()
        .min(1945)
        .max(2500)
        .required()
        .messages(joiValidation('Tahun')),
});

export {
    createMemberSavingValidation,
};