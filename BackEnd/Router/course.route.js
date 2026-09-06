import express from "express";

import authMiddleware, {
    isAdmin
} from "../Middlewares/authMiddleware.js";

import {
    createCourse,
    updateCourse,
    getAllCourses,
    deleteCourse
} from "../Controller/courseController.js";

import { validate }
    from "../Middlewares/validate.js";

import CourseSchema
    from "../Schema/CourseSchema.js";


export const courseRoute =
    express.Router();


courseRoute.get(
    "/view",
    authMiddleware,
    getAllCourses
);


courseRoute.post(
    "/create",
    authMiddleware,
    isAdmin,
    createCourse
);


courseRoute.put(
    "/update/:id",
    authMiddleware,
    isAdmin,
    updateCourse
);


courseRoute.delete(
    "/delete/:id",
    authMiddleware,
    isAdmin,
    deleteCourse
);