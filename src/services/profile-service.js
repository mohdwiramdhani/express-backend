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
        throw new ResponseError(404, "Profil tidak ditemukan");
    }

    profile.createdAt = formatTimezone(profile.createdAt)
    profile.updatedAt = formatTimezone(profile.updatedAt)

    if (profile.dateOfBirth) {
        profile.dateOfBirth = formatDate(profile.dateOfBirth);
    }

    return profile;
};

const getAll = async () => {
    const profiles = await prismaClient.profile.findMany({
        select: {
            userId: true,
            fullName: true,
            nik: true,
            phoneNumber: true,
            address: true,
            dateOfBirth: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return profiles.map(profile => ({
        userId: profile.userId,
        fullName: profile.fullName,
        nik: profile.nik,
        phoneNumber: profile.phoneNumber,
        address: profile.address,
        dateOfBirth: profile.dateOfBirth ? formatDate(profile.dateOfBirth) : null,
        createdAt: formatTimezone(profile.createdAt),
        updatedAt: formatTimezone(profile.updatedAt),
    }));
};

const update = async (userId, request) => {
    const profile = validate(updateProfileValidation, request);

    const existingProfile = await prismaClient.profile.findUnique({ where: { userId } });

    if (!existingProfile) {
        throw new ResponseError(404, "Profil tidak ditemukan");
    }

    if (profile.nik && profile.nik !== existingProfile.nik) {
        const existingProfileByNik = await prismaClient.profile.findUnique({ where: { nik: profile.nik } });

        if (existingProfileByNik) {
            throw new ResponseError(400, "NIK sudah digunakan");
        }
    }

    await prismaClient.profile.update({ where: { userId }, data: profile });
};

export default {
    get,
    getAll,
    update
};