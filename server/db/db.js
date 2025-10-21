const mongoose = require("mongoose");

/**
 * Asynchronously connects to the MongoDB database using the MONGO_URI from .env
 */
async function connectDb() {
    try {
        // Attempt to connect to the database
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDb connected: ${conn.connection.host}`)
    }
    catch (error) {
        console.log("Error connection to MongoDb: ", error.message);
        // Exit the process with a "failure" code (1)
        // If the app cannot connect to its database,it should not continue to run.
        process.exit(1);
    }
}

module.exports = connectDb;