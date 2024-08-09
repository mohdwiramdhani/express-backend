import express from "express";
import userController from "../../controllers/user-controller.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { registerRateLimiter } from '../../config/rate-limit.js';
import { adminMiddleware } from "../../middlewares/admin-middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

userRouter.get('/users/current', userController.get);
userRouter.patch('/users/current', userController.update);

userRouter.post('/users/register', adminMiddleware, registerRateLimiter, userController.registerStaff);
userRouter.delete('/users/:id', adminMiddleware, userController.deleteStaff);

export {
    userRouter
};