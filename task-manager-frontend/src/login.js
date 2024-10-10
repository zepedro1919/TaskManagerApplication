import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken, setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        console.log('Sending login request to the backend...');
        try {
            const response = await axios.post('http://localhost:5000/auth/login', {
                username,
                password
            });

            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                setIsAuthenticated(true);
                setToken(token);

                // Redirect to tasks page
                navigate('/tasks'); // Navigate to the tasks page upon successful login
            } else {
                setErrorMessage('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('Login failed. Please check your credentials.');
        }
    };


    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Register here</a></p>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default Login;
