const joiValidation = (fieldName) => ({
    'string.base': `${fieldName} harus berupa string.`,
    'string.alphanum': `${fieldName} hanya dapat berisi huruf dan angka.`,
    'string.min': `${fieldName} harus terdiri dari minimal {#limit} karakter.`,
    'string.max': `${fieldName} tidak boleh lebih dari {#limit} karakter.`,
    'string.empty': `${fieldName} tidak boleh kosong.`,
    'string.length': `${fieldName} harus terdiri dari {#limit} karakter.`,
    'string.pattern.base': `${fieldName} hanya boleh berisi angka.`,
    'any.required': `${fieldName} wajib diisi.`,
    'number.base': `${fieldName} harus berupa angka.`,
    'number.positive': `${fieldName} harus berupa angka positif.`,
    'number.integer': `${fieldName} harus berupa angka bulat.`,
    'date.base': `${fieldName} harus berupa tanggal yang valid.`,
    'string.uri': `${fieldName} harus berupa URL yang valid.`,
});

export {
    joiValidation,
};
