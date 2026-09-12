import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../Model/usersModel.js"; // Adjust the path to your User model

// Load environment variables (.env)
dotenv.config();

const seedAdmin = async () => {
    try {
        // 1. Connect to MongoDB using your env string
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully for seeding...");

        // 2. Define your default admin credentials
        const adminEmail = "admin@yourdomain.com";
        const defaultPassword = "SuperSecureAdminPassword123!";

        // 3. Check if an admin already exists to prevent duplication
        const existingAdmin = await User.findOne({ emailAddress: adminEmail });
        
        if (existingAdmin) {
            console.log("Admin user already exists. Seeding skipped.");
            process.exit(0);
        }

        // 4. Hash the default password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        // 5. Create the new admin profile matching your exact schema fields
        const adminUser = new User({
            emailAddress: adminEmail,
            password: hashedPassword,
            role: "admin",       // Ensure this matches your role system
            status: "active" ,
            fullName: "System Administrator",
            phone: "0945678901",
            birthDate: new Date("1990-01-01"), // Standard date object
            academicBackground: "Higher Education"    // Explicitly set to active
        });

        // 6. Save to database
        await adminUser.save();
        
        console.log("------------------------------------------------");
        console.log("🚀 Admin account created successfully!");
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: ${defaultPassword}`);
        console.log("⚠️ Remember to change this password after your first login!");
        console.log("------------------------------------------------");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding admin user:", error.message);
        process.exit(1);
    }
};

seedAdmin();
