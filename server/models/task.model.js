const mongoose = require("mongoose");

/**
 * @desc    Mongoose schema for the Task collection.
 * Defines the data structure for an individual task, linking it
 * to an assigned agent and the upload batch it came from.
 */
const taskSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    // Phone numbers are best stored as Strings
    phone: {
        type: String, 
        required: true
    },
    notes: {
        type: String
    },
    // The agent this task is given to
    assignedAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
        required: true
    },
    // The file this task came from
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UploadBatch",
        required: true
    }
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;