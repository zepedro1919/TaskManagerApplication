const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
