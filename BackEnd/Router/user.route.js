import express from "express";

import {register,viewUser,updateUser,getAllStudents,registerUserByAdmin,getMe
} from "../Controller/userController.js";

import authMiddleware, { isAdmin} from "../Middlewares/authMiddleware.js";

import RegistrationSchema from "../Schema/RegistrationSchema.js";

import { validate }from "../Middlewares/validate.js";

import verifyAccessToken from "../Middlewares/authMiddleware.js";


export const userRoute =
    express.Router();


userRoute.post(
    "/register",
    validate(RegistrationSchema),
    register
);


userRoute.get(
    "/view",
    authMiddleware,
    isAdmin,
    viewUser
);


userRoute.put(
    "/update",
    authMiddleware,
    isAdmin,
    updateUser
);


userRoute.get(
    "/students-list",
    authMiddleware,
    isAdmin,
    getAllStudents
);
userRoute.post(
    "/register-staff",
    authMiddleware,
    isAdmin,
    registerUserByAdmin
);

userRoute.get('/me',
     verifyAccessToken,
     getMe);
