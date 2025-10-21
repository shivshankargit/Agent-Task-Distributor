const multer = require("multer");
const path = require("path");

// Define allowed file extensions
// Note: .axls is not a standard Excel format. Assuming you meant .xls (old) and .xlsx (new).
const allowedFileTypes = ['.csv', '.xlsx', '.xls'];

/**
 * Multer file filter to allow only specific file types
 */
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(ext)) {
        // Accept the file
        cb(null, true);
    } else {
        // Reject the file
        cb(new Error("Invalid file type. Only .csv, .xlsx, or .xls are allowed."), false);
    }
};

// Use memoryStorage to hold the file as a buffer
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB file size limit
    }
});

module.exports = upload;