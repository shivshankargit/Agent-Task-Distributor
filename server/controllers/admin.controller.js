const z = require("zod");
const Admin = require("../models/admin.model");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookies");

// Zod schema for validating the admin sign-in request body
const signinBody = z.object({
    email: z.email(),
    password: z.string().min(8)
})

/**
 * @desc    Authenticate admin and get a token
 * @route   POST /api/admin/signin
 * @access  Public
 */
const signin = async (req, res) => {
    try {
        // 1. Validate the request body using Zod
        const validation = signinBody.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input format.",
                errors: validation.error.errors
            });
        }

        const { email, password} = validation.data;

        // 2. Find the admin in the database
        const admin = await Admin.findOne({email: email});

        // 3. Compare password securely
        // Must check if admin exists *before* trying to compare password
        const isPasswordValid = admin ? await admin.comparePassword(password) : false;

        // Return 401 (Unauthorized) if admin not found or password is a mismatch
        if(!admin || !isPasswordValid) {
            return res.status(401).json({
                success: false, 
                message: "Invalid email or password"
            })
        }

        // 4. Generate JWT and set it as an httpOnly cookie
        generateTokenAndSetCookie(res, admin._id);

        // 5. Send success response with sanitized user data
        res.status(200).json({
            success: true,
            message: "Sign-in successfull",
            user: {
                _id: admin._id,
                email: admin.email
            },
        });

    } catch (error) {
        // Catch-all for any unexpected internal server errors
        console.log("Error in signin", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

/**
 * @desc    Log out the admin by clearing the auth cookie
 * @route   POST /api/admin/logout
 * @access  Private (Requires JWT)
 */
const logout = (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * @desc    Check if an admin is already authenticated (e.g., for page loads)
 * @route   GET /api/admin/check-auth
 * @access  Private (Requires JWT)
 */
const checkAuth = async (req, res) => {
    try {
        // req.userId is expected to be populated by the `verifyJWT` auth middleware
        const admin = await Admin.findById(req.userId).select("-password");

        if (!admin) {
            // This can happen if the user was deleted but their token is still valid
            return res.status(404).json({ 
                success: false,
                message: "Admin not found"
            });
        }

        // Send back the authenticated user's data
        res.status(200).json({
            success: true,
            user: admin 
        });
    } catch (error) {
        console.log("Error in checkAuth controller:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error"
        });
    }
}

module.exports = { signin, checkAuth, logout }