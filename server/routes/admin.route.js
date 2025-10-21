const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const { signin, checkAuth, logout} = require("../controllers/admin.controller");

// Initialize the express router
const router = express.Router();

// --- Admin Auth Routes ---

// Checks if a user is currently authenticated (protected)
router.get("/check", verifyToken, checkAuth);

// Handles admin sign-in
router.post("/signin", signin);

// Handles admin logout (clears cookie)
router.post("/logout", logout)

module.exports = router;
