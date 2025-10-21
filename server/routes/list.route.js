const express = require("express");
const verifyToken = require("../middleware/verifyToken.js");
const upload = require("../middleware/upload.js");
const { uploadList, getTasksForAgent } = require("../controllers/list.controller.js");

const router = express.Router();

// --- List & Task Routes ---

// Handles file upload for creating tasks (protected, uses multer for file)
router.post(
    "/upload",
    verifyToken,
    upload.single('file'), // Expects a single file in a field named 'file'
    uploadList
);

// Gets all tasks assigned to a specific agent (protected)
router.get("/agent/:id", verifyToken, getTasksForAgent);

module.exports = router;