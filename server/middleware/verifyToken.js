const jwt = require("jsonwebtoken");

/**
 * @desc    Express middleware to verify a JSON Web Token (JWT).
 * If the token is valid, it decodes the payload, attaches the `userId` 
 * to the `req` object, and passes control to the next middleware or controller.
 */
const verifyToken = (req, res, next) => {
    // 1. Attempt to get the token from the request's httpOnly cookies
    const token = req.cookies.token;

    // 2. Check if the token exists
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Unauthorized - no token provided"
        })
    }

    // 3. Verify the token if it exists
    try{
        // Decode the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET_AUTH); 

        // Attach the user ID from the token payload to the request object
        // This makes the user's ID available to all subsequent protected routes
        req.userId = decoded.userId;

        // Pass control to the next function in the middleware stack
        next();
        
    } catch (error) {
        // This block catches errors from `jwt.verify` (e.g., expired token, invalid signature)
        console.log("Error in verifyToken middleware", error);

        // Send a generic 401 Unauthorized for security
        res.status(401).json({
            success: false,
            message: "Unauthorized - Invalid token"
        });
    }
}

module.exports = verifyToken;