import userService from "../services/user-service.js";

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);
        res.status(201).json({
            data: result,
            message: "User registered successfully"
        });
    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json({
            data: result,
            message: "Login successfully"
        });
    } catch (e) {
        next(e);
    }
}

export default {
    register,
    login,
}