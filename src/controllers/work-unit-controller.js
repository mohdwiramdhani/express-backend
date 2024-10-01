import workUnitService from "../services/work-unit-service.js";

const create = async (req, res, next) => {
    try {
        await workUnitService.create(req.body);

        res.status(201).json({ message: "Unit kerja berhasil ditambahkan" });
    } catch (e) {
        next(e);
    }
};

const get = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await workUnitService.get(id);
        res.status(200).json({
            data: result,
            message: "Unit kerja berhasil ditemukan"
        });
    } catch (e) {
        next(e);
    }
};

const getAll = async (req, res, next) => {
    try {
        const result = await workUnitService.getAll();
        res.status(200).json({
            data: result,
            message: "Semua unit kerja berhasil ditemukan"
        });
    } catch (e) {
        next(e);
    }
};

//ERROR
const update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const request = req.body;

        await workUnitService.update(id, request);
        res.status(200).json({
            message: "Unit kerja berhasil diperbarui"
        });
    } catch (e) {
        next(e);
    }
};

const remove = async (req, res, next) => {
    try {
        const id = req.params.id;

        await workUnitService.remove(id);
        res.status(200).json({
            message: "Unit kerja berhasil dihapus"
        });
    } catch (e) {
        next(e);
    }
};

export default {
    create,
    get,
    getAll,
    update,
    remove
};