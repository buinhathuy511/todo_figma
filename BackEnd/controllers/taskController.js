require("dotenv").config();
const { httpStatusCodes } = require("../utils/constants");
const Task = require("../models/Task");

const handleAddTask = async (req, res) => {
  try {
    const taskData = req.body;
    const user = req.user;

    if (!user || !user.userId) {
      return res
        .status(httpStatusCodes.UNAUTHORIZED)
        .json({ error: "User not authenticated." });
    }

    const newTask = new Task({ ...taskData, userId: user.userId });
    await newTask.save();

    res
      .status(httpStatusCodes.CREATED)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error", details: error.message });
  }
};

const handleGetTasksByToken = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.userId) {
      return res
        .status(httpStatusCodes.UNAUTHORIZED)
        .json({ error: "User not authenticated." });
    }

    const userTasks = await Task.find({ userId: user.userId });
    res.status(httpStatusCodes.OK).json(userTasks);
  } catch (error) {
    console.error("Error: ", error);
    res
      .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error", details: error.message });
  }
};

const handleUpdateTask = async (req, res) => {
  try {
    const { _id, text, completed } = req.body;
    const user = req.user;

    const task = await Task.findOne({ _id });
    if (!task || task.userId.toString() !== user.userId.toString()) {
      return res
        .status(httpStatusCodes.FORBIDDEN)
        .json({ error: "You do not have permission to update this task" });
    }

    const updateFields = {};
    if (text) updateFields.text = text;
    if (typeof completed !== "undefined") updateFields.completed = completed;

    const updatedTask = await Task.findByIdAndUpdate(
      _id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(httpStatusCodes.NOT_FOUND)
        .json({ error: "Task not found" });
    }

    res
      .status(httpStatusCodes.OK)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res
      .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const handleDeleteTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const task = await Task.findOne({ _id: id });
    if (!task || task.userId.toString() !== user.userId.toString()) {
      return res
        .status(httpStatusCodes.FORBIDDEN)
        .json({ error: "You do not have permission to delete this task" });
    }

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res
        .status(httpStatusCodes.NOT_FOUND)
        .json({ error: "Task not found" });
    }

    res
      .status(httpStatusCodes.OK)
      .json({ message: `Task with id ${id} was deleted successfully` });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

module.exports = {
  handleAddTask,
  handleGetTasksByToken,
  handleUpdateTask,
  handleDeleteTaskById,
};
