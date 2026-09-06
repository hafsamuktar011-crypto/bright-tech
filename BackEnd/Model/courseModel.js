import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        courseName: {
            type: String,
            required: true,
            trim: true
        },

        courseCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        description: {
            type: String
        },

        credits: {
            type: Number,
            required: true,
            default: 3
        },

        instructorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        batchNumber: {
            type: String,
            required: true
        },

        programType: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Course =
    mongoose.model("Course", courseSchema);

export default Course;