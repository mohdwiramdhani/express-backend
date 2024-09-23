import { validate } from "../validations/validation.js";
import { getProfileValidation, updateProfileValidation } from "../validations/profile-validation.js";
import { prismaClient } from "../config/database.js";
import { ResponseError } from "../errors/response-error.js";
import { formatDate, formatTimezone } from "../helpers/date-helper.js";

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

    profile.createdAt = formatTimezone(profile.createdAt)
    profile.updatedAt = formatTimezone(profile.updatedAt)

    if (profile.dateOfBirth) {
        profile.dateOfBirth = formatDate(profile.dateOfBirth);
    }

    return profile;
};

const update = async (userId, request) => {
    const profile = validate(updateProfileValidation, request);

    const existingProfile = await prismaClient.profile.findUnique({ where: { userId } });

    if (!existingProfile) {
        throw new ResponseError(404, "Profile not found");
    }

    if (profile.nik && profile.nik !== existingProfile.nik) {
        const existingProfileByNik = await prismaClient.profile.findUnique({ where: { nik: profile.nik } });

        if (existingProfileByNik) {
            throw new ResponseError(400, "NIK already exists");
        }
    }

    await prismaClient.profile.update({ where: { userId }, data: profile });
};

export default {
    get,
    update
};