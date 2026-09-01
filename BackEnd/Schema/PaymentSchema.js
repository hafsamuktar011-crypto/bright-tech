import { z } from "zod";

export const PaymentSchema = z.object({
    amount: z
        .coerce
        .number({
            required_error: "Amount is required"
        })
        .positive({
            message:
                "Amount must be a positive number"
        }),

    paymentMethod: z
        .enum(["Transfer", "Cash"], {
            required_error:
                "Payment method is required"
        }),

    transactionId: z
        .string({
            required_error:
                "Transaction ID is required"
        })
        .trim()
        .min(5, {
            message:
                "Transaction ID must be at least 5 characters"
        }),

    courseId: z
        .string({
            required_error:
                "Course ID is required"
        })
        .trim()
        .min(1, {
            message:
                "Course ID is required"
        }),

    coursePrice: z
        .coerce
        .number({
            required_error:
                "Course price is required"
        })
        .positive(),

    paymentType: z
        .enum(["full", "partial"], {
            required_error:
                "Payment type is required"
        }),

    receiptUrl: z
        .string()
        .optional()
});