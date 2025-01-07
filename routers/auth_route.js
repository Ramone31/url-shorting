const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");

const path=require("path")

const router = express.Router();

// Route for initiating Google OAuth login
router.get("/auth/google",passport.authenticate("google", { scope: ["profile", "email"] })
);

// Route for handling the Google OAuth callback
router.get("/auth/google/callback",passport.authenticate("google", { session: false }),authController.googleSignIn // After authentication, this controller will handle token generation
);


router.get("/form", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

module.exports = router;
