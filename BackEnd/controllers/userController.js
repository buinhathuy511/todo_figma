require("dotenv").config();
const { httpStatusCodes } = require("../utils/constants");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleSignIn = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(httpStatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(httpStatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid email or password" });
    }

    const tokenOptions = rememberMe ? { expiresIn: "7d" } : { expiresIn: "1h" };
    const userToken = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY,
      tokenOptions
    );

    res.status(httpStatusCodes.OK).json({
      token: userToken,
      username: user.username,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res
      .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const handleSignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(httpStatusCodes.BAD_REQUEST)
        .json({ error: "Username, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(httpStatusCodes.CONFLICT)
        .json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const userToken = jwt.sign(
      { userId: newUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(httpStatusCodes.CREATED).json({
      token: userToken,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res
      .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

module.exports = {
  handleSignIn,
  handleSignUp,
};
