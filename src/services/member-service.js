import { validate } from "../validations/validation.js";
import { registerMemberValidation } from "../validations/member-validation.js";
import { prismaClient } from "../config/database.js";
import { ResponseError } from "../errors/response-error.js";
import bcrypt from "bcrypt";

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

export default {
    register
};