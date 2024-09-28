import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './services/taskService';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  // Create a new task
  const handleAddTask = async () => {
    try {
      const newTask = { name: taskName, completed: false };
      await createTask(newTask);
      fetchTasks(); // Refresh the task list
      setTaskName(''); // Clear the input field
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  // Update a task's completion status
  const handleToggleTaskCompletion = async (id, completed) => {
    try {
      await updateTask(id, { completed: !completed });
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>

      {/* Task Input */}
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Enter a task name"
      />
      <button onClick={handleAddTask}>Add Task</button>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => handleToggleTaskCompletion(task._id, task.completed)} 
            />
            <span
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
            >
              {task.name}
            </span>
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;
