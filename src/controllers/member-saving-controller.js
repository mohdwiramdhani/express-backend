import memberSavingService from "../services/member-saving-service.js";

const create = async (req, res, next) => {
    try {
        await memberSavingService.create(req.body);

        res.status(201).json({ message: `Simpanan berhasil dibuat` });
    } catch (e) {
        next(e);
    }
};

const getByYear = async (req, res, next) => {
    try {
        const year = parseInt(req.params.year);
        const savings = await memberSavingService.getByYear(year);
        res.status(200).json(savings);
    } catch (e) {
        next(e);
    }
};

const getByYearAndWorkUnit = async (req, res, next) => {
    try {
        const year = parseInt(req.params.year);
        const workUnitId = parseInt(req.params.workUnitId);
        const savings = await memberSavingService.getByYearAndWorkUnit(year, workUnitId);
        res.status(200).json(savings);
    } catch (e) {
        next(e);
    }
};

export default {
    create,
    getByYear,
    getByYearAndWorkUnit
};