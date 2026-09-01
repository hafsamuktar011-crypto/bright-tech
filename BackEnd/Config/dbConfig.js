import mongoose from "mongoose";

function DBConnect() {
    mongoose
        .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/StudentManagement")
        .then(() => console.log("MongoDB connected successfully"))
        .catch((error) => {
            console.error("MongoDB connection error:", error.message);
        });
}

export default DBConnect;