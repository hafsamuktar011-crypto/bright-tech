import jwt from "jsonwebtoken";
import User from "../Model/usersModel.js";

function authMiddleware(req, res, next) {
    const token = req.cookies.StudentAccessToken;
    console.log(token)

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
        const userId = req.user.id;

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

const verifyAccessToken = async (req, res, next) => {
    const AuthHeader = req.headers.authorization;
    if(!AuthHeader || !AuthHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "Unauthorized"})
    }
    const token = AuthHeader.split(" ")[1];
    if(!token) {
        return res.status(401).json({message: "access missing or invalid"})
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        //attach the user to the request object
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: "token missing or invalid or expired"})
    }
}

export default authMiddleware;