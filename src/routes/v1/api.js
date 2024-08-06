import express from "express";
import userController from "../../controllers/user-controller.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

userRouter.get('/users/current', userController.get);

export {
    userRouter
}