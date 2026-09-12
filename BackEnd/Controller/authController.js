import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../Model/usersModel.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import sendEmail from "../utils/sendEmail.js";
import toSafeUser from "../utils/toSafeUser.js";


export const login = async (req, res) => {
    const { emailAddress, password } = req.body;
  
    try {
      const DUMMY_PASSWORD = process.env.DUMMY_PASSWORD;
  
      const user = await User.findOne({
        emailAddress,
        status: "active"
      });
  
      const hashToCompare = user
        ? user.password
        : DUMMY_PASSWORD;
  
      const isMatch = await bcrypt.compare(
        password,
        hashToCompare
      );
  
      if (!user || !isMatch) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }
  
      const accessToken = generateAccessToken(
        String(user._id),
        user.role
      );
  
      const refreshToken = generateRefreshToken(
        String(user._id),
        user.role
      );
  
    //   res.cookie("StudentAccessToken", accessToken, {
    //     httpOnly: true,
    //     secure:false,
    //     maxAge: 15 * 60 * 1000,
    //     path: "/",
    //     sameSite: "lax"
    //   });
  
      res.cookie("StudentRefreshToken", refreshToken, {
        httpOnly: true,
        secure:false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
        sameSite: "lax"
      });
  
      return res.status(200).json({
        message: "Login successful",
        user: toSafeUser(user),
        accessToken:accessToken
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

        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

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
    
    //get the token from the cookies by the name RefreshToken
    const token = req.cookies.RefreshToken;

    if (!token) {
        return res.status(401).json({
            message: "no refreshtoken found provided"
        });
    }

    try {
        //verify the teoken
        const decoded = jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET
        );
 //generate access token
        const newAccessToken = generateAccessToken(
            decoded.id,
            decoded.role
        );
//set the new access in the cookie
        res.cookie("AccessToken", newAccessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            path:"/",
            sameSite:"lax"
        });
//return new access token
        return res.status(200).json({
             accessToken: newAccessToken 
        });

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
};




export const refreshAccessToken = async (req, res) => {
  try {
    // Get the refresh token from the HttpOnly cookie
    const refreshToken = req.cookies.StudentRefreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token found",
      });
    }

    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Generate a new access token
    const newAccessToken = generateAccessToken(
      decoded.id,
      decoded.role
    );

    // Send the new access token as an HttpOnly cookie
    res.cookie("StudentAccessToken", newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      path: "/",
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Access token refreshed successfully",
    });

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
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



export const registerFirstAdmin = async (req, res) => {
  try {
    const {fullName,emailAddress, password,phone,birthDate,academicBackground,gender } = req.body;

    
    const existingAdmin = await User.findOne({ role: 'admin' });

    
    let assignedRole = 'student';
    if (!existingAdmin) {
      assignedRole = 'admin'; 
    } else {
      return res.status(403).json({ 
        message: "Admin registration is closed. An administrator already exists." 
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        fullName,
        emailAddress,
         password,
         phone,
         birthDate,
         academicBackground,
         gender,
      password: hashedPassword,
      role: assignedRole,
    });

    await newUser.save();

    res.status(201).json({ 
      success: true, 
      message:` First admin account successfully created for ${emailAddress}.` 
    });

  } catch (error) {
    console.error("Register admin error:",error)
    res.status(500).json({ success: false, error: error.message });
  }
};