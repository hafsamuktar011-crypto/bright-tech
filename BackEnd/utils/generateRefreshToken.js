import jwt from "jsonwebtoken";

function generateRefreshToken(id, role) {
    return jwt.sign(
        {
            id,
            role
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d"
        }
    );
}

export default generateRefreshToken;