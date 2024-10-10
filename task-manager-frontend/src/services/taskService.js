import axios from 'axios';

const API_URL = 'http://localhost:5000/tasks';

// Fetch all tasks
const getTasks = async (token) => {
  return await axios.get(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Create a new task
const createTask = async (task, token) => {
  return await axios.post(API_URL, task, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Update a task
const updateTask = async (id, updatedTask, token) => {
  return await axios.put(`${API_URL}/${id}`, updatedTask, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Delete a task
const deleteTask = async (id, token) => {
  return await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export { getTasks, createTask, updateTask, deleteTask };
