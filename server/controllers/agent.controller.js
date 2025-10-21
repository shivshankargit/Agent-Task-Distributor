const z = require("zod");
const Agent = require("../models/agent.model");

// Zod schema for validating the agent creation request body
const agentBodySchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email(),
    
    // Regex ensures the mobile number starts with a '+' and a country code.
    // e.g., +911234567890
    mobileNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, "Mobile number must include country code (e.g., +91)"),
    
    password: z.string().min(8, "Password must be at least 8 characters")
});

/**
 * @desc    Create a new agent.
 * @route   POST /api/agent/create
 * @access  Protected (Admin)
 */
const createAgent = async (req, res) => {
    // 1. Validate the request body
    const validation = agentBodySchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid input data.",
            errors: validation.error.errors
        });
    }

    try {
        const { name, email, mobileNumber, password } = validation.data;

        // 2. Check if an agent with this email already exists
        const existingAgent = await Agent.findOne({ email });
        if (existingAgent) {
            // Return 409 (Conflict) if the email is already in use
            return res.status(409).json({
                success: false,
                message: "An agent with this email already exists."
            });
        }

        // 3. Create a new agent instance
        const newAgent = new Agent({
            name,
            email,
            mobileNumber,
            password
            // Note: The password will be hashed by the 'pre-save' middleware
            // in the agent.model.js file.
        });

        // 4. Save the new agent to the database
        await newAgent.save();

        // 5. Send a success response
        // return a 201 (Created) status code.
        // explicitly build the response object to avoid sending
        // the hashed password back to the client.
        res.status(201).json({
            success: true,
            message: "Agent created successfully.",
            agent: {
                _id: newAgent._id,
                name: newAgent.name,
                email: newAgent.email,
                mobileNumber: newAgent.mobileNumber,
                createdAt: newAgent.createdAt
            }
        });

    } catch (error) {
        console.log("Error in createAgent controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

/**
 * @desc    Get all agents
 * @route   GET /api/agent/all
 * @access  Protected (Admin)
 */
const getAllAgents = async (req, res) => {
    try {
        // Find all agents, select only name and email
        const agents = await Agent.find().select("name email").sort({ name: 1 });
        res.status(200).json({ success: true, agents });
    } catch (error) {
        console.log("Error in getAllAgents:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    createAgent,
    getAllAgents
};