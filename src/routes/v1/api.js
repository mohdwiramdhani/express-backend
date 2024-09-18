import express from "express";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { adminMiddleware } from "../../middlewares/admin-middleware.js";
import userController from "../../controllers/user-controller.js";
import profileController from "../../controllers/profile-controller.js";
import memberController from "../../controllers/member-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.post('/users/register', adminMiddleware, userController.registerStaff);
userRouter.get('/users/current', userController.get);
userRouter.patch('/users/current', userController.update);
userRouter.delete('/users/:id', adminMiddleware, userController.deleteStaff);

// Profile API
userRouter.get('/profile/current', profileController.get);
userRouter.patch('/profile/current', profileController.update);

// Member API
userRouter.post('/members/register', adminMiddleware, memberController.register);

export {
    userRouter
};