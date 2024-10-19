import express from "express";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { adminMiddleware } from "../../middlewares/admin-middleware.js";
import userController from "../../controllers/user-controller.js";
import profileController from "../../controllers/profile-controller.js";
import workUnitController from "../../controllers/work-unit-controller.js";
import memberController from "../../controllers/member-controller.js";
import memberSavingController from "../../controllers/member-saving-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.post('/users/register', adminMiddleware, userController.registerStaff);
userRouter.get('/users/current', userController.get);
userRouter.patch('/users/current', userController.update);
userRouter.get('/users', adminMiddleware, userController.getAll);
userRouter.delete('/users/:id', adminMiddleware, userController.removeStaff);

// Profile API
userRouter.get('/profile/current', profileController.get);
userRouter.patch('/profile/current', profileController.update);
userRouter.get('/profiles', adminMiddleware, profileController.getAll);

// Work Unit API
userRouter.post('/work-unit', workUnitController.create);
userRouter.get('/work-unit/:id', workUnitController.get);
userRouter.get('/work-unit', workUnitController.getAll);
userRouter.patch('/work-unit/:id', workUnitController.update);
userRouter.delete('/work-unit/:id', workUnitController.remove);

// Member API
userRouter.post('/members/register', memberController.register);
userRouter.get('/members/:id', memberController.get);
userRouter.get('/members', memberController.getAll);
userRouter.patch('/members/:id', memberController.update);
userRouter.delete('/members/:id', memberController.remove);
userRouter.post('/members/:id/reset-password', memberController.resetPassword);

// Member API
userRouter.post('/savings', memberSavingController.create);

export {
    userRouter
};