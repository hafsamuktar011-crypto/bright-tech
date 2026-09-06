import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../Model/usersModel.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import sendEmail from "../utils/sendEmail.js";


export const login = async (req, res) => {
    const { emailAddress, password } = req.body;

    try {
        const user = await User.findOne({ emailAddress });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id, user.role);

        res.cookie("StudentAccessToken", accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            path:"/",
            sameSite:"lax"
        });

        res.cookie("StudentRefreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path:"/",
            sameSite:"lax"
        });

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            message: "Login successful",
            user: userResponse
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


export const forgotPassword = async (req, res) => {
    const { emailAddress } = req.body;

    try {
        const user = await User.findOne({ emailAddress });

        if (!user) {
            return res.status(404).json({
                message: "No account found with this email"
            });
        }

        // Reset token is a short-lived JWT so resetPassword can
        // verify it with jwt.verify and recover the user id.
        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Save reset token
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

        await sendEmail(
            user.emailAddress,
            "Password Reset Request",
            `You requested a password reset. Please click this link to reset your password: ${resetLink}`
        );

        return res.status(200).json({
            message: "Reset link sent successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


export const resetPassword = async (req, res) => {
    const {
        token,
        newPassword
    } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({
            message: "Token and new password are required"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findOne({
            _id: decoded.id,
            passwordResetToken: token,
            passwordResetExpires: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token"
            });
        }

        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        return res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {
        return res.status(400).json({
            message: "Invalid or expired token"
        });
    }
};


export const updatePassword = async (req, res) => {
    const {
        oldPassword,
        newPassword
    } = req.body;

    const userId = req.user.id;

    try {
        const user = await User
            .findById(userId)
            .select("password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch =
            await bcrypt.compare(
                oldPassword,
                user.password
            );

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password incorrect"
            });
        }

        user.password =
            await bcrypt.hash(newPassword, 10);

        await user.save();

        return res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


export const refresh = async (req, res) => {
    const token = req.cookies.StudentRefreshToken;

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

        const newAccessToken = generateAccessToken(
            decoded.id,
            decoded.role
        );

        res.cookie("StudentAccessToken", newAccessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000
        });

        return res.status(200).json({
            message: "Token refreshed successfully"
        });

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
};


export const logout = async (req, res) => {
    res.clearCookie("StudentAccessToken");
    res.clearCookie("StudentRefreshToken");

    return res.status(200).json({
        message: "Logged out successfully"
    });
};


export const refreshAccessToken = async (req, res) => {
  try {
    // 1. Get refresh token from HTTP-only cookies
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found. Please log in." });
    }

    // 2. Verify the refresh token using your secret
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 3. Generate a new short-lived access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    // 4. Send back the new access token
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token." });
  }
};
export const registerFirstAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if ANY admin user already exists in the database
    const existingAdmin = await User.findOne({ role: 'admin' });

    // 2. Determine the role based on whether an admin exists
    // If an admin exists, block this endpoint or default to 'student'
    let assignedRole = 'student';
    if (!existingAdmin) {
      assignedRole = 'admin'; // This is the very first user!
    } else {
      return res.status(403).json({ 
        message: "Admin registration is closed. An administrator already exists." 
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: assignedRole
    });

    await newUser.save();

    res.status(201).json({ 
      success: true, 
      message:` First admin account successfully created for ${email}.` 
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};