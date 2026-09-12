import jwt from "jsonwebtoken";

function generateAccessToken(id, role) {
    return jwt.sign(
        {
            id,
            role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "15m"
        }
    );
}

export default generateAccessToken;