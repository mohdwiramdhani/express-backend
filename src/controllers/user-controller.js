import userService from "../services/user-service.js";

const register = async (req, res, next) => {
    try {
        await userService.register(req.body);

        res.status(201).json({ message: "Pengguna berhasil didaftarkan" });
    } catch (e) {
        next(e);
    }
};

const registerStaff = async (req, res, next) => {
    try {
        await userService.registerStaff(req.body);

        res.status(201).json({ message: "Pengguna dengan peran staff berhasil ditambahkan" });
    } catch (e) {
        next(e);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);

        res.status(200).json({
            data: result,
            message: "Login berhasil"
        });
    } catch (e) {
        next(e);
    }
};

const get = async (req, res, next) => {
    try {
        const id = req.user.id;
        const result = await userService.get(id);

        res.status(200).json({
            data: result,
            message: "Pengguna berhasil ditemukan"
        });
    } catch (e) {
        next(e);
    }
};

const getAll = async (req, res, next) => {
    try {
        const result = await userService.getAll();

        res.status(200).json({
            data: result,
            message: "Semua user berhasil ditemukan"
        });
    } catch (e) {
        next(e);
    }
};

const update = async (req, res, next) => {
    try {
        const id = req.user.id;
        const request = { ...req.body, id };

        await userService.update(request);
        res.status(200).json({
            message: "Pengguna berhasil diperbarui"
        });
    } catch (e) {
        next(e);
    }
};

// const refreshToken = async (req, res, next) => {
//     try {
//         const { refreshToken } = req.body;
//         const result = await userService.refreshToken(refreshToken);

//         res.status(200).json({
//             data: result,
//             message: "Token refreshed successfully"
//         });
//     } catch (e) {
//         next(e);
//     }
// };

const removeStaff = async (req, res, next) => {
    try {
        const id = req.params.id;

        await userService.removeStaff(id);
        res.status(200).json({
            message: "Staf berhasil dihapus"
        });
    } catch (e) {
        next(e);
    }
};

export default {
    register,
    registerStaff,
    login,
    get,
    getAll,
    update,
    // refreshToken,
    removeStaff
};