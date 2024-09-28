import axios from 'axios';

const API_URL = 'http://localhost:5000/tasks';

// Fetch all tasks
const getTasks = async () => {
  return await axios.get(API_URL);
};

// Create a new task
const createTask = async (task) => {
  return await axios.post(API_URL, task);
};

// Update a task
const updateTask = async (id, updatedTask) => {
  return await axios.put(`${API_URL}/${id}`, updatedTask);
};

// Delete a task
const deleteTask = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

export { getTasks, createTask, updateTask, deleteTask };
