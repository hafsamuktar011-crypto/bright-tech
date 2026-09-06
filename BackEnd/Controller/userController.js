import bcrypt from "bcrypt";
import User from "../Model/usersModel.js";


export const register = async (req, res) => {
    try {
        const {
            emailAddress,
            password,
            phone,
            ...otherData
        } = req.body;

        const existingUser = await User.findOne({
            $or: [
                { emailAddress },
                { phone }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email or phone already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const newUser = await User.create({
            ...otherData,
            emailAddress,
            phone,
            password: hashedPassword
        });

        const userResponse =
            newUser.toObject();

        delete userResponse.password;

        return res.status(201).json({
            message: "User registered successfully",
            data: userResponse
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


export const viewUser = async (req, res) => {
    try {
        const users = await User
            .find()
            .select("-password");

        return res.status(200).json({
            data: users
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};


export const updateUser = async (req, res) => {
    try {
        const data = req.body;

        const updatedUser =
            await User.findOneAndUpdate(
                { phone: data.phone },
                { $set: data },
                {
                    new: true,
                    runValidators: true
                }
            ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "Phone number not found"
            });
        }

        return res.status(200).json({
            message: "Successfully updated",
            data: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};


export const getAllStudents = async (req, res) => {
    try {
        const students = await User
            .find({ role: "student" })
            .select("-password");

        return res.status(200).json({
            data: students
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
export const registerUserByAdmin =async (req,res) => {
    try {
        const {
            emailAddress,
            password,
            phone,
            ...otherData
        } = req.body;
      const existUser=await User.findOne({$or:[{emailAddress:emailAddress},{phone:phone}]
    });
      if(existUser){
        return res.status(400).json({message:"User with this email or phone already exists"})
      } 
      const hashedPassword =await bcrypt.hash(password,10)
      const newUser =await User.create({
            emailAddress,
            phone,
            password:hashedPassword,
            ...otherData       
});
return res.status(201).json({message:"User registered successfully",user:newUser})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const getMe=async (req,res) => {
    //user get from verifyAccessToken middleware
try {
    const user =await user.findById(req.user.id).select("-password");
    if(!user){
        return res.status(404).json({message:"User not found"})
    }return res.status(200).json({message:"User found",user:user})
}catch (error) {
        return res.status(500).json({message:error.message + "server error"})
    }
}