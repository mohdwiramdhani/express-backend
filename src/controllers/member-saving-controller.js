import memberSavingService from "../services/member-saving-service.js";

const create = async (req, res, next) => {
    try {
        await memberSavingService.create(req.body);

        res.status(201).json({ message: `Simpanan berhasil dibuat` });
    } catch (e) {
        next(e);
    }
};

export default {
    create,
};