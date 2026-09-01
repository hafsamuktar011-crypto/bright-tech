import express from "express";

import authMiddleware, {
    isAdmin
} from "../Middlewares/authMiddleware.js";

import {
    studentSubmitPayment,
    reviewPayment,
    getAllPayments
} from "../Controller/paymentController.js";

import {
    PaymentSchema
} from "../Schema/PaymentSchema.js";

import { validate }
    from "../Middlewares/validate.js";


export const paymentRoute =
    express.Router();


paymentRoute.post(
    "/submit",
    authMiddleware,
    validate(PaymentSchema),
    studentSubmitPayment
);


paymentRoute.put(
    "/review/:id",
    authMiddleware,
    isAdmin,
    reviewPayment
);


paymentRoute.get(
    "/get",
    authMiddleware,
    isAdmin,
    getAllPayments
);