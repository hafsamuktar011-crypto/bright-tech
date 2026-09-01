import jwt from "jsonwebtoken";
import User from "../Model/usersModel.js";

function authMiddleware(req, res, next) {
    const token = req.cookies.StudentAccessToken;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const user = await User
            .findById(userId)
            .select("role");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admin only."
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            message: "Server error during authorization"
        });
    }
};

export default authMiddleware;