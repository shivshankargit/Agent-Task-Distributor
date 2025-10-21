const express = require("express");
const verifyToken = require("../middleware/verifyToken.js");
const { createAgent, getAllAgents } = require("../controllers/agent.controller.js");

const router = express.Router();

// --- Agent Routes ---

// Creates a new agent (protected)
router.post("/add", verifyToken, createAgent);

// Gets a list of all agents (protected)
router.get("/all", verifyToken, getAllAgents);


module.exports = router;