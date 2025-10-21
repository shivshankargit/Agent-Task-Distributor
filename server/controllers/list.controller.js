const z = require("zod");
const path = require("path");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const { Readable } = require("stream");

const Agent = require("../models/agent.model");
const Task = require("../models/task.model");
const UploadBatch = require("../models/uploadBatch.model");

// Zod schema to validate each row from the file
const taskRowSchema = z.object({
    FirstName: z.string().min(1, "FirstName is required"),
    Phone: z.any().transform(val => String(val)), // Coerce Phone to string
    Notes: z.string().optional()
});


/**
 * @route   POST /api/lists/upload
 * @desc    Uploads a list, parses it, and distributes tasks
 * @access  Protected (Admin)
 */
const uploadList = async (req, res) => {
    try {
        // 1. Check if file exists
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded." });
        }

        // 2. Fetch the 5 agents
        // We'll sort by creation date, but you could use any logic
        const agents = await Agent.find().sort({ createdAt: 1 }).limit(5);
        if (agents.length < 5) {
            return res.status(400).json({ 
                success: false, 
                message: `Not enough agents in system. Found ${agents.length}, require 5.` 
            });
        }

        // 3. Create the Upload Batch record
        const batch = new UploadBatch({
            fileName: req.file.originalname,
            uploadedBy: req.userId // From verifyToken middleware
        });
        await batch.save();

        // 4. Parse the file buffer
        let parsedRows;
        try {
            parsedRows = await parseFileBuffer(req.file);
        } catch (parseError) {
            return res.status(400).json({ success: false, message: parseError.message });
        }

        // 5. Validate and Distribute Tasks
        const tasksToInsert = [];
        const validationErrors = [];

        for (let i = 0; i < parsedRows.length; i++) {
            const row = parsedRows[i];
            const validation = taskRowSchema.safeParse(row);

            if (!validation.success) {
                // Log the error and skip this row
                validationErrors.push(`Row ${i + 2}: ${validation.error.errors[0].message}`);
                continue; // Skip this invalid row
            }

            // Distribution logic:
            // (i % 5) assigns tasks sequentially: 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, ...
            const agentIndex = i % 5;
            const assignedAgentId = agents[agentIndex]._id;

            tasksToInsert.push({
                firstName: validation.data.FirstName,
                phone: validation.data.Phone,
                notes: validation.data.Notes || '',
                assignedAgent: assignedAgentId,
                batch: batch._id
            });
        }
        
        // 6. Save tasks to database
        if (tasksToInsert.length > 0) {
            await Task.insertMany(tasksToInsert);
        }

        // 7. Update batch with final task count
        batch.totalTasks = tasksToInsert.length;
        await batch.save();

        res.status(201).json({
            success: true,
            message: `File uploaded successfully. ${tasksToInsert.length} tasks distributed.`,
            newBatch: batch,
            errors: validationErrors.length > 0 ? validationErrors : "No errors."
        });

    } catch (error) {
        console.log("Error in uploadList controller:", error.message);
        if (error.message.includes("Invalid file type")) {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * @route   GET /api/lists/agent/:id
 * @desc    Get all tasks assigned to a specific agent
 * @access  Protected (Admin)
 */
const getTasksForAgent = async (req, res) => {
    try {
        const agentId = req.params.id;
        const tasks = await Task.find({ assignedAgent: agentId })
            .populate("batch", "fileName createdAt") // Get batch info
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks: tasks
        });
    } catch (error) {
        console.log("Error in getTasksForAgent:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// --- HELPER FUNCTION ---

/**
 * Parses a file buffer from Multer into an array of objects.
 * Handles both CSV and Excel files.
 * @param {object} file - The req.file object from Multer
 * @returns {Promise<Array<object>>} A promise that resolves to an array of row objects
 */
async function parseFileBuffer(file) {
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (ext === '.csv') {
        // --- Parse CSV ---
        return new Promise((resolve, reject) => {
            const results = [];
            const stream = Readable.from(file.buffer);
            stream
                .pipe(csv({
                    // Ensure headers match your expected format
                    mapHeaders: ({ header }) => header.trim()
                }))
                .on("data", (data) => results.push(data))
                .on("end", () => resolve(results))
                .on("error", (error) => reject(new Error("Error parsing CSV: " + error.message)));
        });

    } else if (ext === '.xlsx' || ext === '.xls') {
        // --- Parse Excel ---
        try {
            const workbook = xlsx.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0]; // Get the first sheet
            const worksheet = workbook.Sheets[sheetName];
            // Convert sheet to JSON
            const json = xlsx.utils.sheet_to_json(worksheet, {
                raw: true, // Use raw values (e.t., for phones)
            });
            return json;
        } catch (error) {
            throw new Error("Error parsing Excel file: " + error.message);
        }
    } else {
        throw new Error("Unsupported file type for parsing.");
    }
}


module.exports = {
    uploadList,
    getTasksForAgent
};