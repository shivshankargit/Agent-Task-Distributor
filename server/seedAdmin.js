/**
 * Standalone script to seed the database with a default admin user.
 * Usage: node seedAdmin.js
 */

const mongoose = require("mongoose");
const Admin = require("./models/admin.model")
require("dotenv").config();

// --- Default Admin Credentials ---
// Hardcoded credentials for the initial admin user.
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Admin#%234";

/**
 * @desc    Connects to the database, checks for an existing admin,
 * and creates a new one if it doesn't exist.
 */
const seedAdmin = async () => {
    try {
        // 1. Connect to the database
        const dbUrl = process.env.MONGO_URI;
        if (!dbUrl) {
            throw new Error("DATABASE_URL not found in .env file");
        }
        await mongoose.connect(dbUrl);
        console.log("Database connected...");

        // 2. Check if the admin user already exists
        // This makes the script "idempotent" (safe to run multiple times).
        const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
        if (existingAdmin) {
            console.log("Admin user already exists.");
        return; 
        }

        // 3. Create and save the new admin user
        console.log("Creating new admin user...");
        const admin = new Admin({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        });

        // Calling .save() will trigger the 'pre-save' hook in `admin.model.js`
        // which will securely hash the password before saving.
        await admin.save(); 
        
        console.log("Admin user created successfully!");
        console.log(`   Email: ${admin.email}`);
        
    } catch (error) {
        // Log any errors that occur during the process
        console.error("Error seeding admin user:", error.message);
    } finally {
        // 4. Disconnect from the database
        // Ensures the script exits properly
        await mongoose.disconnect();
        console.log("Database disconnected.");
    }
};

// --- Execute the Script ---
// Call the function to run the seeder
seedAdmin();