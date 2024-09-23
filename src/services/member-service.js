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
        throw new ResponseError(400, "NIK already exists");
    }

    const workUnit = await prismaClient.workUnit.findUnique({
        where: { id: member.workUnitId }
    });

    if (!workUnit) {
        throw new ResponseError(400, "Work Unit not found");
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
        throw new ResponseError(404, "Member not found");
    }

    const { username, role, memberProfile } = member;

    const formattedMember = {
        username,
        role: role.name,
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

export default {
    register,
    get
};