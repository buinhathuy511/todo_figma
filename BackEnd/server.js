const express = require("express");
const cors = require("cors");
const { connectDatabase } = require("./config/database");
const corsOptions = require("./config/cors");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const hostname = "127.0.0.1";
const port = 5000;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to Database
connectDatabase()
  .then(() => {
    // Routes - Thêm prefix /api
    app.use("/tasks", taskRoutes);
    app.use("/auth", userRoutes); // Thay đổi từ /auth thành /api/auth

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: "Internal Server Error" });
    });

    app.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
