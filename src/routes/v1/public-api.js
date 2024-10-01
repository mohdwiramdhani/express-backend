import express from "express";
import userController from "../../controllers/user-controller.js";
import { loginRateLimiter, registerRateLimiter } from '../../config/rate-limit.js';

const publicRouter = new express.Router();

publicRouter.post('/users/xqc', registerRateLimiter, userController.register);
publicRouter.post('/users/login', loginRateLimiter, userController.login);

// publicRouter.post('/users/refresh-token', userController.refreshToken);

publicRouter.get('/test', (req, res) => {
    res.send("Hello, world");
});

export {
    publicRouter
}