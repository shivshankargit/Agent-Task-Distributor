const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * @desc    Mongoose schema for the Agent collection.
 * Defines the data structure for an agent user, including
 * personal details and hashed password.
 */
const agentSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true, // Store email in a consistent, lowercase format
        trim: true       // Remove any leading/trailing whitespace
    },
    mobileNumber: {
        type: String,
        required: [true, "Mobile number is required"],
        trim: true
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
 * * It only runs if the 'password' field has been modified.
 */
agentSchema.pre("save", async function (next) {
    // 1. If the password field wasn't modified, skip hashing.
    // This prevents re-hashing the password every time an agent
    // updates their name, email, or mobile number.
    if (!this.isModified("password")) {
        return next();
    }

    // 2. If the password *is* new or modified, hash it
    try {
        // Generate a salt with 10 rounds
        const salt = await bcrypt.genSalt(10);
        // Hash the plain-text password with the salt
        this.password = await bcrypt.hash(this.password, salt);
        // Proceed to the next step (saving)
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
agentSchema.methods.comparePassword = async function (enteredPassword) {
    // Use bcrypt's compare function to safely check the password
    // This handles both the hashing and comparison in one step.
    return await bcrypt.compare(enteredPassword, this.password);
};

// --- Model Export ---

// Create the model from the schema
const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;