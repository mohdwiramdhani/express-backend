import { validate } from "../validations/validation.js";
import { prismaClient } from "../config/database.js";
import { ResponseError } from "../errors/response-error.js";
import { createMemberSavingValidation } from "../validations/member-saving-validation.js";

const create = async (request) => {
    const memberSaving = validate(createMemberSavingValidation, request);

    const existingSavingsForYear = await prismaClient.memberSaving.findFirst({
        where: { year: memberSaving.year },
    });

    if (existingSavingsForYear) {
        throw new ResponseError(400, `Simpanan untuk tahun ${memberSaving.year} sudah ada.`);
    }

    const members = await prismaClient.memberProfile.findMany();

    if (members.length === 0) {
        throw new ResponseError(404, "Tidak ada anggota yang ditemukan");
    }

    for (const member of members) {
        for (let month = 1; month <= 12; month++) {
            const existingSaving = await prismaClient.memberSaving.findUnique({
                where: {
                    year_month_memberProfileId: {
                        year: memberSaving.year,
                        month: month,
                        memberProfileId: member.id,
                    }
                }
            });

            if (!existingSaving) {
                await prismaClient.memberSaving.create({
                    data: {
                        year: memberSaving.year,
                        month: month,
                        principal: 0,
                        mandatory: 0,
                        voluntary: 0,
                        memberProfileId: member.id,
                        workUnitId: member.workUnitId,
                    }
                });
            }
        }
    }
};

const getByYear = async (year) => {
    const savings = await prismaClient.memberSaving.findMany({
        where: { year },
        include: {
            memberProfile: {
                include: {
                    workUnit: true,
                }
            }
        },
        orderBy: [
            { memberProfile: { workUnitId: 'asc' } },
            { month: 'asc' }
        ]
    });

    if (savings.length === 0) {
        throw new ResponseError(404, `Tidak ada data simpanan untuk tahun ${year}`);
    }

    return savings.map(saving => ({
        memberId: saving.memberProfile.id,
        memberName: saving.memberProfile.fullName,
        workUnit: saving.memberProfile.workUnit.name,
        year: saving.year,
        month: saving.month,
        principal: saving.principal,
        mandatory: saving.mandatory,
        voluntary: saving.voluntary,
    }));
};

const getByYearAndWorkUnit = async (year, workUnitId) => {
    const savings = await prismaClient.memberSaving.findMany({
        where: {
            year,
            memberProfile: {
                workUnitId
            }
        },
        include: {
            memberProfile: true
        },
        orderBy: { month: 'asc' }
    });

    if (savings.length === 0) {
        throw new ResponseError(404, `Tidak ada data simpanan untuk tahun ${year} di unit kerja tersebut.`);
    }

    return savings.map(saving => ({
        memberId: saving.memberProfile.id,
        memberName: saving.memberProfile.fullName,
        year: saving.year,
        month: saving.month,
        principal: saving.principal,
        mandatory: saving.mandatory,
        voluntary: saving.voluntary,
    }));
};

export default {
    create,
    getByYear,
    getByYearAndWorkUnit
};