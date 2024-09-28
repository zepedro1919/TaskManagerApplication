const express = require('express'); // Import express
const mongoose = require('mongoose');
require('dotenv').config();

const app = express(); // Initialize express

app.use(express.json()); // Middleware to parse JSON

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const cors = require('cors');
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));


// Create a task
const Task = require('./tasks');

app.post('/tasks', async (req, res) => {
  try {
    const { name, completed } = req.body;

    // Check if task name is provided
    if (!name) {
      return res.status(400).json({ error: 'Task name is required' }); // Return to stop further execution
    }

    const task = new Task({ name, completed: completed || false });
    const result = await task.save();

    // Send the created task in response
    return res.status(201).json(result);  // Use return to ensure only one response is sent
  } catch (error) {
    // Handle any errors that occurred during saving
    return res.status(500).json({ error: error.message }); // Ensure only one response is sent
  }
});



// Get all tasks
app.get('/tasks', async (req, res) => {
  const filter = {};
  if (req.query.completed) filter.completed = req.query.completed === 'true';
  if (req.query.priority) filter.priority = req.query.priority;
  
  const tasks = await Task.find(filter);
  res.json(tasks);
});



// Get task by ID
app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Invalid Task ID' });
  }
});


// Update task by ID
app.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        completed: req.body.completed,
        priority: req.body.priority,
        dueDate: req.body.dueDate
      },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Delete task by ID
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Invalid Task ID' });
  }
});
