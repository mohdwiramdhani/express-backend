import memberService from "../services/member-service.js";

const register = async (req, res, next) => {
    try {
        await memberService.register(req.body);

        res.status(201).json({ message: "Anggota berhasil didaftarkan" });
    } catch (e) {
        next(e);
    }
};

const get = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await memberService.get(id);

        res.status(200).json({
            data: result,
            message: "Anggota berhasil ditemukan"
        });
    } catch (e) {
        next(e);
    }
};

const getAll = async (req, res, next) => {
    try {
        const result = await memberService.getAll();

        res.status(200).json({
            data: result,
            message: "Semua anggota berhasil ditemukan"
        });
    } catch (e) {
        next(e);
    }
};

const update = async (req, res, next) => {
    try {
        const id = req.params.id;
        await memberService.update(id, req.body);

        res.status(200).json({
            message: "Anggota berhasil diperbarui"
        });
    } catch (e) {
        next(e);
    }
};

const remove = async (req, res, next) => {
    try {
        const id = req.params.id;
        await memberService.remove(id);

        res.status(200).json({
            message: "Anggota berhasil dihapus"
        });
    } catch (e) {
        next(e);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const id = req.params.id;
        await memberService.resetPassword(id);
        res.status(200).json({ message: "Password berhasil direset" });
    } catch (e) {
        next(e);
    }
};

export default {
    register,
    get,
    getAll,
    update,
    remove,
    resetPassword
};