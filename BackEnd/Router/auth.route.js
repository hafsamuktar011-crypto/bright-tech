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
    "/me",
    resetPassword
);

authRoute.put(
    "/newPassword",
    authMiddleware,
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