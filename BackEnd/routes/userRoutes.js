const express = require("express");
const router = express.Router();
const { handleSignIn, handleSignUp } = require("../controllers/userController");

router.post("/sign-in", handleSignIn);
router.post("/sign-up", handleSignUp);

module.exports = router;
