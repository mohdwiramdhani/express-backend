import express from "express";
import userController from "../../controllers/user-controller.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { registerRateLimiter } from '../../config/rate-limit.js';

const userRouter = new express.Router();
userRouter.use(authMiddleware);

userRouter.get('/users/current', userController.get);
userRouter.patch('/users/current', userController.update);
userRouter.post('/users/register', registerRateLimiter, userController.registerStaff);
userRouter.delete('/users/:id', userController.deleteStaff);

export {
    userRouter
};