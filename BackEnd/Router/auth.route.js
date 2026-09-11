import express from "express";

import {
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    logout,
    refreshAccessToken,
    registerFirstAdmin,
    
    
} from "../Controller/authController.js";

import authMiddleware from "../Middlewares/authMiddleware.js";
import { validate } from "../Middlewares/validate.js";
import LoginSchema from "../Schema/LoginSchema.js";
import {
    loginRateLimit,
    forgotPasswordRateLimit,
    resetPasswordRateLimit,
    updatePasswordRateLimit,
} from "../Middlewares/rateLimit.js";

export const authRoute = express.Router();

authRoute.post(
    "/login",
    loginRateLimit,
    validate(LoginSchema),
    login
);

authRoute.post(
    "/forgot-password",
    forgotPasswordRateLimit,
    forgotPassword
);



authRoute.post(
    "/me",
    resetPasswordRateLimit,
    resetPassword
);

authRoute.put(
    "/newPassword",
    authMiddleware,
    updatePasswordRateLimit,
    updatePassword
);

// authRoute.post(
//     "/refresh",
//     refresh
// );

authRoute.post(
    "/logout",
    logout
);


authRoute.post(
    "/refresh-access-token",
    refreshAccessToken
);
authRoute.post(
         "/register-admin",
         registerFirstAdmin
     );