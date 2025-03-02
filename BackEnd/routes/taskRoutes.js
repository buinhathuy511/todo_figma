const express = require("express");
const router = express.Router();
const {
  handleAddTask,
  handleGetTasksByToken,
  handleUpdateTask,
  handleDeleteTaskById,
} = require("../controllers/taskController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/get-tasks", authenticateToken, handleGetTasksByToken);
router.post("/add-task", authenticateToken, handleAddTask);
router.put("/update-task", authenticateToken, handleUpdateTask);
router.delete("/delete-task/:id", authenticateToken, handleDeleteTaskById);

module.exports = router;
