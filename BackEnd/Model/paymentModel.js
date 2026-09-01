import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        coursePrice: {
            type: Number,
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        paymentType: {
            type: String,
            enum: ["full", "partial"],
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ["Transfer", "Cash"],
            required: true
        },

        transactionId: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },

        receiptUrl: {
            type: String
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "denied"
            ],
            default: "pending"
        },

        paymentDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Payment =
    mongoose.model("Payment", paymentSchema);

export default Payment;