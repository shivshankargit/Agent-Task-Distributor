const jwt = require ("jsonwebtoken");

/**
 * Generates a JWT and sets it as an httpOnly cookie on the response.
 */
const generateTokenAndSetCookie = async (res, userId) => {
    // 1. Generate the JWT with the userId payload, expiring in 7 days
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_AUTH, {
        expiresIn: "7d"
    });

    // 2. Set the JWT as an httpOnly cookie
    res.cookie ("token", token, {
        // Prevents client-side JavaScript from accessing the cookie.
        httpOnly: true,

        // secure: true (in production)
        // Ensures the cookie is only sent over HTTPS.
        secure: process.env.NODE_ENV === "production",

        // Mitigates CSRF (Cross-Site Request Forgery) attacks by ensuring
        // the cookie is only sent for requests originating from the same site.
        sameSite: "strict",

        // Sets the cookie's expiration time in milliseconds to match the JWT's expiration.
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
    });
    
    return token;
}

module.exports = generateTokenAndSetCookie;