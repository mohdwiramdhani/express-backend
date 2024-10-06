import { validate } from "../validations/validation.js";
import { registerMemberValidation, getMemberValidation } from "../validations/member-validation.js";
import { prismaClient } from "../config/database.js";
import { ResponseError } from "../errors/response-error.js";
import bcrypt from "bcrypt";
import { formatDate, formatTimezone } from "../helpers/date-helper.js";

const register = async (request) => {
    const member = validate(registerMemberValidation, request);

    const usernamePassword = member.nik;

    const countMember = await prismaClient.member.count({
        where: { username: usernamePassword }
    });

    if (countMember > 0) {
        throw new ResponseError(400, "NIK sudah digunakan");
    }

    const workUnit = await prismaClient.workUnit.findUnique({
        where: { id: member.workUnitId }
    });

    if (!workUnit) {
        throw new ResponseError(400, "Unit Kerja tidak ditemukan");
    }

    const hashedPassword = await bcrypt.hash(usernamePassword, 10);

    const newMember = await prismaClient.member.create({
        data: {
            username: usernamePassword,
            password: hashedPassword,
            roleId: 3
        }
    });

    await prismaClient.memberProfile.create({
        data: {
            fullName: member.fullName,
            nik: member.nik,
            phoneNumber: member.phoneNumber,
            address: member.address,
            dateOfBirth: member.dateOfBirth,
            workUnitId: member.workUnitId,
            memberId: newMember.id
        }
    });
};

const get = async (id) => {
    id = validate(getMemberValidation, id);

    const member = await prismaClient.member.findUnique({
        where: { id },
        select: {
            username: true,
            role: {
                select: {
                    name: true
                }
            },
            memberProfile: {
                select: {
                    fullName: true,
                    nik: true,
                    phoneNumber: true,
                    address: true,
                    dateOfBirth: true,
                    photoUrl: true,
                    createdAt: true,
                    updatedAt: true

                }
            }
        }
    });

    if (!member) {
        throw new ResponseError(404, "Anggota tidak ditemukan");
    }

    const { username, role: { name: role }, memberProfile } = member;

    const formattedMember = {
        username,
        role,
        fullName: memberProfile.fullName,
        nik: memberProfile.nik,
        phoneNumber: memberProfile.phoneNumber,
        address: memberProfile.address,
        dateOfBirth: formatDate(memberProfile.dateOfBirth),
        photoUrl: memberProfile.photoUrl,
        createdAt: formatTimezone(memberProfile.createdAt),
        updatedAt: formatTimezone(memberProfile.updatedAt)
    };

    return formattedMember;
};

const getAll = async () => {
    const members = await prismaClient.member.findMany({
        select: {
            id: true,
            username: true,
            role: {
                select: {
                    name: true
                }
            },
            memberProfile: {
                select: {
                    fullName: true,
                    nik: true,
                    phoneNumber: true,
                    address: true,
                    dateOfBirth: true,
                    photoUrl: true,
                    createdAt: true,
                    updatedAt: true
                }
            }
        }
    });

    return members.map(member => ({
        id: member.id,
        username: member.username,
        role: member.role.name,
        fullName: member.memberProfile.fullName,
        nik: member.memberProfile.nik,
        phoneNumber: member.memberProfile.phoneNumber,
        address: member.memberProfile.address,
        dateOfBirth: formatDate(member.memberProfile.dateOfBirth),
        photoUrl: member.memberProfile.photoUrl,
        createdAt: formatTimezone(member.memberProfile.createdAt),
        updatedAt: formatTimezone(member.memberProfile.updatedAt)
    }));
};

const update = async (id, request) => {
    id = validate(getMemberValidation, id);

    const member = await prismaClient.member.findUnique({
        where: { id },
        select: {
            memberProfile: {
                select: {
                    nik: true,
                }
            }
        }
    });

    if (!member) {
        throw new ResponseError(404, "Anggota tidak ditemukan");
    }

    const updatedProfileData = {
        fullName: request.fullName,
        nik: request.nik,
        phoneNumber: request.phoneNumber,
        address: request.address,
        dateOfBirth: request.dateOfBirth,
        photoUrl: request.photoUrl,
        workUnitId: request.workUnitId
    };

    if (request.nik && request.nik !== member.memberProfile.nik) {
        const newUsername = request.nik;
        const newPassword = await bcrypt.hash(newUsername, 10);

        await prismaClient.member.update({
            where: { id },
            data: {
                username: newUsername,
                password: newPassword
            }
        });
    }

    await prismaClient.memberProfile.update({
        where: { memberId: id },
        data: updatedProfileData
    });
};

const remove = async (id) => {
    id = validate(getMemberValidation, id);

    const member = await prismaClient.member.findUnique({
        where: { id }
    });

    if (!member) {
        throw new ResponseError(404, "Anggota tidak ditemukan");
    }

    await prismaClient.memberProfile.delete({
        where: { memberId: id }
    });

    await prismaClient.member.delete({
        where: { id }
    });
};

const resetPassword = async (id) => {
    id = validate(getMemberValidation, id);

    const member = await prismaClient.member.findUnique({
        where: { id },
        select: {
            memberProfile: {
                select: {
                    nik: true
                }
            }
        }
    });

    if (!member) {
        throw new ResponseError(404, "Anggota tidak ditemukan");
    }

    const nik = member.memberProfile.nik;

    const newPassword = await bcrypt.hash(nik, 10);

    await prismaClient.member.update({
        where: { id },
        data: {
            password: newPassword
        }
    });
};

export default {
    register,
    get,
    getAll,
    update,
    remove,
    resetPassword
};