import memberService from "../services/member-service.js";

const register = async (req, res, next) => {
    try {
        await memberService.register(req.body);

        res.status(201).json({ message: "Member registered successfully" });
    } catch (e) {
        next(e);
    }
};

export default {
    register,
};