import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from './services/taskService';
import Login from './login';
import Register from './Register';
import { jwtDecode } from 'jwt-decode';
import './App.css';

function App() {

  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filterPriority, setFilterPriority] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticação
  const [token, setToken] = useState(null);

  // Check if there is a saved token on first load
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const decodedToken = jwtDecode(savedToken);
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Check if token has expired
        if (decodedToken.exp > currentTime) {
          setToken(savedToken);
          setIsAuthenticated(true);
          fetchTasks(savedToken);
        } else {
          // If token is expired, clear it and redirect to login
          localStorage.removeItem('token');
          setToken(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  const fetchTasks = async (token) => {
    try {
      const response = await getTasks(token); // Passa o token ao fazer a requisição
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  // Função de adicionar tarefas
  const handleAddTask = async () => {
    try {
      const newTask = { name: taskName, dueDate, priority, completed: false };
      await createTask(newTask, token); // Passa o token para a criação da tarefa
      setTaskName(''); // Limpa o campo
      setDueDate('');
      setPriority('medium');
      fetchTasks(token); // Atualiza a lista de tarefas
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  // Update a task's completion status
  const handleToggleTaskCompletion = async (id, completed) => {
    try {
      await updateTask(id, { completed: !completed }, token);
      fetchTasks(token); // Refresh the task list
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id, token);
      fetchTasks(token); // Refresh the task list
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };


  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/tasks" />
            ) : (
              <Login setToken={setToken} setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/tasks" />
            ) : (
              <Register />
            )
          }
        />
        {/* Protected route */}
        <Route path="/tasks" element={isAuthenticated ? (
          <div className="App">
            <h1>Task Manager</h1>
            <div className='task-form'>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter a task name"
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button className='Add' onClick={handleAddTask}>Add Task</button>
            </div>

            {/* Filters */}
            <div className="filter-section">
              <label>Filter by Priority:</label>
              <select onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Task List */}
            <ul className='task-list'>
              {tasks
                .filter((task) => !filterPriority || task.priority === filterPriority)
                .map((task) => (
                  <li key={task._id} className='task-item'>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTaskCompletion(task._id, task.completed)}
                    />
                    <span
                      style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                    >
                      {task.name} - {task.priority} - {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <button className='Delete' onClick={() => handleDeleteTask(task._id)}>Delete</button>
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <Navigate to="/login" />
        )} />

        {/* Default Route: Redirects to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;