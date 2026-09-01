import express from "express";

import {
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    refresh,
    logout
} from "../Controller/authController.js";

import authMiddleware from "../Middlewares/authMiddleware.js";
import { validate } from "../Middlewares/validate.js";
import LoginSchema from "../Schema/LoginSchema.js";

export const authRoute = express.Router();

authRoute.post(
    "/login",
    validate(LoginSchema),
    login
);

authRoute.post(
    "/forgot-password",
    forgotPassword
);

authRoute.post(
    "/reset-password",
    resetPassword
);

authRoute.put(
    "/newPassword",
    authMiddleware,
    updatePassword
);

authRoute.post(
    "/refresh",
    refresh
);

authRoute.post(
    "/logout",
    logout
);