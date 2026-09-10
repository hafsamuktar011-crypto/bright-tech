import mongoose from "mongoose";
import Payment from "../Model/paymentModel.js";
import Course from "../Model/courseModel.js";

const REVIEW_STATUSES = ["approved", "rejected"];

export const studentSubmitPayment = async (req, res) => {
    try {
        const {
            amount,
            paymentMethod,
            transactionId,
            courseId,
            coursePrice,
            paymentType,
            receiptUrl
        } = req.body;

        const courseCode = String(courseId).trim().toUpperCase();
        const course = mongoose.isValidObjectId(courseId)
            ? await Course.findOne({
                $or: [{ _id: courseId }, { courseCode }]
            })
            : await Course.findOne({ courseCode });

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if (transactionId) {
            const duplicateTransaction = await Payment.findOne({
                transactionId
            });

            if (duplicateTransaction) {
                return res.status(400).json({
                    message: "This transaction ID has already been submitted."
                });
            }
        }

        const newPayment = await Payment.create({
            studentId: req.user.id,
            courseId: course._id,
            coursePrice,
            amount,
            paymentType,
            paymentMethod,
            ...(transactionId ? { transactionId } : {}),
            receiptUrl,
            status: "pending"
        });

        return res.status(201).json({
            message: "Payment submitted successfully. Waiting for admin approval.",
            data: newPayment
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const reviewPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const status = String(req.body.status || "").toLowerCase();

        if (!REVIEW_STATUSES.includes(status)) {
            return res.status(400).json({
                message: "Status must be approved or rejected."
            });
        }

        const payment = await Payment.findById(id);

        if (!payment) {
            return res.status(404).json({
                message: "Payment receipt record not found."
            });
        }

        if (payment.status !== "pending") {
            return res.status(400).json({
                message: "This payment has already been reviewed."
            });
        }

        payment.status = status;
        const updatedPayment = await payment.save();

        return res.status(200).json({
            message: `Payment status updated to: ${status}`,
            data: updatedPayment
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({
            studentId: req.user.id
        })
            .populate("courseId", "courseCode")
            .select("-__v")
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            data: payments
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("studentId", "fullName emailAddress")
            .populate("courseId", "courseName courseCode")
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            data: payments
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};