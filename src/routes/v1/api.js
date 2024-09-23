import express from "express";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { adminMiddleware } from "../../middlewares/admin-middleware.js";
import userController from "../../controllers/user-controller.js";
import profileController from "../../controllers/profile-controller.js";
import workUnitController from "../../controllers/work-unit-controller.js";
import memberController from "../../controllers/member-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.post('/users/register', adminMiddleware, userController.registerStaff);
userRouter.get('/users/current', userController.get);
userRouter.patch('/users/current', userController.update);
userRouter.delete('/users/:id', adminMiddleware, userController.removeStaff);

// Profile API
userRouter.get('/profile/current', profileController.get);
userRouter.patch('/profile/current', profileController.update);

// Work Unit API
userRouter.post('/work-unit', workUnitController.create);
userRouter.get('/work-unit/:id', workUnitController.get);
userRouter.get('/work-unit', workUnitController.getAll);
userRouter.patch('/work-unit/:id', workUnitController.update);
userRouter.delete('/work-unit/:id', workUnitController.remove);

// Member API
userRouter.post('/members/register', adminMiddleware, memberController.register);

export {
    userRouter
};