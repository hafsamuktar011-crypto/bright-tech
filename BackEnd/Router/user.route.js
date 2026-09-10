import express from "express";

import {register,viewUser,updateUser,getAllStudents,getAllInstructors,registerUserByAdmin,getStudent
} from "../Controller/userController.js";

import authMiddleware, { isAdmin} from "../Middlewares/authMiddleware.js";

import RegistrationSchema from "../Schema/RegistrationSchema.js";

import { validate }from "../Middlewares/validate.js";


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
userRoute.get(
    "/instructors-list",
    authMiddleware,
    isAdmin,
    getAllInstructors
);
userRoute.post(
    "/register-staff",
    authMiddleware,
    isAdmin,
    registerUserByAdmin
);

userRoute.get(
    "/student",
    authMiddleware,
    getStudent
);
