import Joi from "joi";
import { joiValidation } from "../utils/translate-utils.js";

const registerMemberValidation = Joi.object({
    memberNumber: Joi.string()
        .max(20)
        .pattern(/^[0-9]+$/)
        .required()
        .messages(joiValidation('Nomor anggota')),
    fullName: Joi.string()
        .max(255)
        .required()
        .messages(joiValidation('Nama lengkap')),
    nik: Joi.string()
        .length(16)
        .pattern(/^[0-9]+$/)
        .required()
        .messages(joiValidation('NIK')),
    phoneNumber: Joi.string()
        .max(20)
        .allow(null, '')
        .messages(joiValidation('Nomor telepon')),
    address: Joi.string()
        .allow(null, '')
        .messages(joiValidation('Alamat')),
    dateOfBirth: Joi.date()
        .allow(null, '')
        .messages(joiValidation('Tanggal lahir')),
    photoUrl: Joi.string()
        .uri()
        .allow(null, '')
        .messages(joiValidation('URL foto')),
    workUnitId: Joi.number()
        .integer()
        .required()
        .messages(joiValidation('ID unit kerja'))
});

const getMemberValidation = Joi.number()
    .positive()
    .required()
    .messages(joiValidation('ID anggota'));

export {
    registerMemberValidation,
    getMemberValidation
};