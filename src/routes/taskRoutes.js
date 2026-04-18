import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    // - Create task
    const task = new Task({
      title,
      description,
      // - Attach owner = req.user._id
      owner: req.user._id
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    // - Return only tasks belonging to req.user
    const tasks = await Task.find({ owner: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    // - Check ownership
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).json({ error: "Task not found or not authorized." });
    }

    // - Delete task
    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

export default router;