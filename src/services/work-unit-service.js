import { validate } from "../validations/validation.js";
import { createWorkUnitValidation, getWorkUnitValidation, updateWorkUnitValidation } from "../validations/work-unit-validation.js";
import { prismaClient } from "../config/database.js";
import { ResponseError } from "../errors/response-error.js";

const create = async (request) => {
    const workUnit = validate(createWorkUnitValidation, request);

    const countWorkUnit = await prismaClient.workUnit.count({
        where: { name: workUnit.name }
    });

    if (countWorkUnit > 0) {
        throw new ResponseError(400, "Name already exists");
    }

    await prismaClient.workUnit.create({
        data: workUnit
    });
};

const get = async (id) => {
    id = validate(getWorkUnitValidation, id);

    const workUnit = await prismaClient.workUnit.findUnique({
        where: { id },
        select: {
            name: true
        }
    });

    if (!workUnit) {
        throw new ResponseError(404, "Work unit not found");
    }

    return workUnit;
};

const getAll = async () => {
    const workUnits = await prismaClient.workUnit.findMany({
        select: {
            id: true,
            name: true
        }
    });

    return workUnits;
};

const update = async (id, request) => {
    const workUnit = validate(updateWorkUnitValidation, request);

    const existingWorkUnit = await prismaClient.workUnit.findFirst({
        where: {
            name: workUnit.name,
            NOT: {
                id: parseInt(id),
            },
        },
    });

    if (existingWorkUnit) {
        throw new ResponseError(400, "Name already exists");
    }

    const targetWorkUnit = await prismaClient.workUnit.findUnique({
        where: { id: parseInt(id) },
    });

    if (!targetWorkUnit) {
        throw new ResponseError(404, "Work unit not found");
    }

    await prismaClient.workUnit.update({
        where: { id: parseInt(id) },
        data: workUnit,
    });
};

const remove = async (id) => {
    id = validate(getWorkUnitValidation, id);

    const existingWorkUnit = await prismaClient.workUnit.findUnique({
        where: {
            id: id
        }
    });

    if (!existingWorkUnit) {
        throw new ResponseError(404, "Work unit not found");
    }

    const relatedMemberCount = await prismaClient.memberProfile.count({
        where: { workUnitId: id }
    });

    if (relatedMemberCount > 0) {
        throw new ResponseError(400, `Cannot delete work unit with ${relatedMemberCount} member(s) related`);
    }

    await prismaClient.workUnit.delete({
        where: { id },
    });
};

export default {
    create,
    get,
    getAll,
    update,
    remove
};