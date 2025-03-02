require("dotenv").config();
const jwt = require("jsonwebtoken");
const { httpStatusCodes } = require("../utils/constants");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(httpStatusCodes.UNAUTHORIZED)
      .json({ error: "Authorization token is missing or invalid." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user = { userId: decodedToken.userId };
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res
      .status(httpStatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid or expired token." });
  }
};

module.exports = authenticateToken;
