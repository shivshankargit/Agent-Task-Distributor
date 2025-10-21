const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDb = require("./db/db");
const adminRouter = require ("./routes/admin.route");
const agentRoutes = require("./routes/agent.route");
const listRoutes = require("./routes/list.route");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// --- Middleware Setup ---

// Enable Cross-Origin Resource Sharing (CORS)
// Allows the frontend (CLIENT_URL) to make requests and receive cookies
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse cookies from incoming requests
app.use(cookieParser());

// Define the port from environment variables, defaulting to 3001
const PORT = process.env.PORT || 3001;

// --- API Routes ---

// Mount the routers for different parts of the API
app.use("/api/admin", adminRouter);
app.use("/api/agents", agentRoutes);
app.use("/api/lists", listRoutes);

// Start the server
app.listen(PORT, () => {
    // Connect to the database when the server starts
    connectDb();
    console.log(`Server is running on port ${PORT}`);
})