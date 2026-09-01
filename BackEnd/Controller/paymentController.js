import Payment from "../Model/paymentModel.js";
import Course from "../Model/courseModel.js";


export const studentSubmitPayment =
    async (req, res) => {

    try {
        const studentId = req.user.id;

        const {
            amount,
            paymentMethod,
            transactionId,
            courseId,
            coursePrice,
            paymentType,
            receiptUrl
        } = req.body;


        // Check course
        const course =
            await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }


        // Check duplicate transaction
        const duplicateTransaction =
            await Payment.findOne({
                transactionId
            });

        if (duplicateTransaction) {
            return res.status(400).json({
                message:
                    "This transaction ID has already been submitted."
            });
        }


        // Create payment
        const newPayment =
            await Payment.create({
                studentId,
                courseId,
                coursePrice,
                amount,
                paymentType,
                paymentMethod,
                transactionId,
                receiptUrl
            });


        return res.status(201).json({
            message:
                "Receipt submitted successfully. Awaiting Admin verification.",
            data: newPayment
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


export const reviewPayment =
    async (req, res) => {

    try {
        const { id } = req.params;
        const { status } = req.body;

        if (
            !status ||
            !["approved", "denied"]
                .includes(status.toLowerCase())
        ) {
            return res.status(400).json({
                message:
                    "Please provide a valid status update"
            });
        }


        const updatedPayment =
            await Payment.findByIdAndUpdate(
                id,
                {
                    status:
                        status.toLowerCase()
                },
                {
                    new: true,
                    runValidators: true
                }
            );


        if (!updatedPayment) {
            return res.status(404).json({
                message:
                    "Payment receipt record not found."
            });
        }


        return res.status(200).json({
            message:
               ` Receipt status updated to: ${status.toLowerCase()}`,
            data: updatedPayment
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


export const getAllPayments =
    async (req, res) => {

    try {
        const payments =
            await Payment.find()
                .populate(
                    "studentId",
                    "fullName emailAddress"
                )
                .populate(
                    "courseId",
                    "courseName courseCode"
                )
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