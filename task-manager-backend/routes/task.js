const express = require('express');
const Task = require('../models/tasks');
const authenticateToken = require('../middleware/authMiddleware')

const router = express.Router();

// Create a task (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, priority, dueDate, completed } = req.body;
        if (!name) return res.status(400).json({ error: 'Task name is required' });

        const task = new Task({ name, priority, dueDate, completed });
        const result = await task.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all tasks
router.get('/', authenticateToken, async (req, res) => {
    const filter = {};
    if (req.query.completed) filter.completed = req.query.completed === 'true';
    if (req.query.priority) filter.priority = req.query.priority;

    const tasks = await Task.find(filter);
    res.json(tasks);
});

// Get task by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: 'Invalid Task ID' });
    }
});

// Update task
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        );
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete task
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Invalid Task ID' });
    }
});

module.exports = router;