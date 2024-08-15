import profileService from "../services/profile-service.js";

const create = async (req, res, next) => {
    try {
        const userId = req.user.id;

        await profileService.create(userId, req.body);
        res.status(201).json({ message: "Profile created successfully" });
    } catch (e) {
        next(e);
    }
};

const get = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const profile = await profileService.get(userId);
        res.status(200).json({
            data: profile,
            message: "Profile retrieved successfully",
        });
    } catch (e) {
        next(e);
    }
};

const update = async (req, res, next) => {
    try {
        const userId = req.user.id;

        await profileService.update(userId, req.body);
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (e) {
        next(e);
    }
};

export default {
    create,
    get,
    update
};