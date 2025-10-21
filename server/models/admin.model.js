const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * @desc    Mongoose schema for the Admin collection.
 * Defines the data structure for an admin user, including
 * their email and hashed password.
 */

const adminSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true,"Email is required"], // Added custom error message
        unique: true, 
        lowercase: true, // Store email in a consistent, lowercase format
        trim: true      // Remove any leading/trailing whitespace
    },

    password: {
        type: String,
        required: [true, "Password is required"]
    },
}, {
    // Automatically adds `createdAt` and `updatedAt` fields
    timestamps: true
});

// --- Mongoose Middleware ---

/**
 * @desc    Mongoose 'pre-save' middleware.
 * This function automatically hashes the admin's password *before*
 * it is saved to the database.
 * * It only runs if the 'password' field has been modified.
 */
adminSchema.pre("save", async function (next) {
    // 1. If the password field wasn't modified, skip hashing.
    // This prevents re-hashing the password every time an admin updates
    // their email or other non-password fields.
    if (!this.isModified("password")) {
        return next();
    }

    // 2. If the password *is* new or modified, hash it
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        // Pass any error to the save operation
        next(error);
    }
});

// --- Mongoose Instance Methods ---

/**
 * @desc    Custom instance method to compare an entered password
 * with the hashed password stored in the database.
 * @param   {string} enteredPassword - The plain-text password from the user.
 * @returns {Promise<boolean>} - True if passwords match, false otherwise.
 */

adminSchema.methods.comparePassword = async function (enteredPassword) {
    // Use bcrypt's compare function to safely check the password
    return await bcrypt.compare(enteredPassword, this.password);
};

// --- Model Export ---

// Create the model from the schema
const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;