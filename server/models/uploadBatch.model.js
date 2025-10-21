const mongoose = require("mongoose");

/**
 * @desc    Mongoose schema for the UploadBatch collection.
 * Tracks each file upload as a "batch", storing the file name,
 * the total number of tasks created, and the admin who uploaded it.
 */
const uploadBatchSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    totalTasks: {
        type: Number,
        default: 0
    },
    // This links to the Admin who uploaded the file
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    }
}, { timestamps: true });

const UploadBatch = mongoose.model("UploadBatch", uploadBatchSchema);
module.exports = UploadBatch;