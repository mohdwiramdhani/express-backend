// src/utils/envUtils.js
const getEnvVariable = (variableName) => {
    const value = process.env[variableName];
    if (!value) {
        throw new Error(`Environment variable ${variableName} is not set`);
    }
    return value;
};

export default getEnvVariable;