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

export default {
    create,
};
