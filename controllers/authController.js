const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

// Function to generate a JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email }, // Payload containing user details
        process.env.JWT_SECRET,            // Secret key from .env
        { expiresIn: '1d' }                // Token valid for 1 day
    );
};

// Google Sign-In Controller
exports.googleSignIn = (req, res) => {
    try {
        // `req.user` is populated by Passport.js middleware
        
        const user = req.user;
       // console.log(user)

        if (!user) {
            return res.status(400).json({ message: "Authentication failed. No user information found." });
        }

        // Generate a JWT for the authenticated user
        const token = generateToken(user);

        // Respond with the token and user information
        // res.status(200).json({
        //     message: "Authentication successful",
        //     token,
        //     user,
        // });

        // res.cookie("authToken", token, { httpOnly: true, secure: true });

        // // Set the email cookie
        // res.cookie("email", user.email, { httpOnly: true, secure: true });


        res.cookie("authToken", token, { path: "/" });

        // Set the email cookie
        res.cookie("email", user.email, {path: "/", expires: new Date(Date.now() + 86400000)});

        // Redirect to the form page
        res.redirect("/form");
    } catch (error) {
        console.error("Google Sign-In Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
