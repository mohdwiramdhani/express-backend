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
        // Ambil ID dari URL params
        const id = req.params.id;

        // Panggil service untuk mendapatkan data member
        const result = await memberService.get(id);

        // Berikan response ke client
        res.status(200).json({
            data: result,
            message: "Member retrieved successfully"
        });
    } catch (e) {
        next(e);
    }
};

export default {
    register,
    get
};