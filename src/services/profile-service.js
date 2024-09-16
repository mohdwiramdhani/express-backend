import { validate } from "../validations/validation.js";
import { getProfileValidation, updateProfileValidation } from "../validations/profile-validation.js";
import { prismaClient } from "../config/database.js";
import { ResponseError } from "../errors/response-error.js";
import moment from 'moment-timezone';

const get = async (userId) => {
    userId = validate(getProfileValidation, userId);

    const profile = await prismaClient.profile.findUnique({
        where: { userId },
        select: {
            fullName: true,
            nik: true,
            phoneNumber: true,
            address: true,
            dateOfBirth: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!profile) {
        throw new ResponseError(404, "Profile not found");
    }

    const timezone = 'Asia/Singapore';
    profile.createdAt = moment(profile.createdAt).tz(timezone).format();
    profile.updatedAt = moment(profile.updatedAt).tz(timezone).format();

    if (profile.dateOfBirth) {
        profile.dateOfBirth = moment(profile.dateOfBirth).format('YYYY-MM-DD');
    }

    return profile;
};

const update = async (userId, request) => {
    const updatedProfile = validate(updateProfileValidation, request);

    const existingProfile = await prismaClient.profile.findUnique({ where: { userId } });

    if (!existingProfile) {
        throw new ResponseError(404, "Profile not found");
    }

    if (updatedProfile.nik && updatedProfile.nik !== existingProfile.nik) {
        const existingProfileByNik = await prismaClient.profile.findUnique({ where: { nik: updatedProfile.nik } });

        if (existingProfileByNik) {
            throw new ResponseError(400, "NIK already exists");
        }
    }

    await prismaClient.profile.update({ where: { userId }, data: updatedProfile });
};

export default {
    get,
    update
};