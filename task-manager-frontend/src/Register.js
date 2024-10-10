import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            console.log('Sending registration request to the backend...');
            const response = await axios.post('http://localhost:5000/auth/register', { username, password });
            console.log('Response:', response.data);
            setMessage('User registered successfully!');
        } catch (error) {
            console.error('Error registering user:', error);
            if (error.response) {
                setMessage(error.response.data.message);
            }
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="/login">Login here</a></p>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
