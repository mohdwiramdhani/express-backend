import memberService from "../services/member-service.js";

const register = async (req, res, next) => {
    try {
        await memberService.register(req.body);

        res.status(201).json({ message: "Member registered successfully" });
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
            message: "Member retrieved successfully"
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
            message: "All Members retrieved successfully"
        });
    } catch (e) {
        next(e);
    }
};

const update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await memberService.update(id, req.body);

        res.status(200).json({
            message: result.message
        });
    } catch (e) {
        next(e);
    }
};

const remove = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await memberService.remove(id);

        res.status(200).json({
            message: result.message
        });
    } catch (e) {
        next(e);
    }
};

export default {
    register,
    get,
    getAll,
    update,
    remove
};