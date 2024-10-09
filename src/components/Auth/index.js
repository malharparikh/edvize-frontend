import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/login' : '/register';
        const payload = isLogin ? { username, password } : { username, password, email };
        try {
            const response = await axios.post(`http://localhost:5000${endpoint}`, payload);
            if (isLogin) {
                localStorage.setItem('accessToken', response.data.access_token);
                localStorage.setItem('refreshToken', response.data.refresh_token);
                setToken(response.data.access_token);
            }
        } catch (error) {
            console.error("Error: ", error.response.data);
        }
    };

    return (
        <div>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {!isLogin && (
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                )}
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Switch to Register' : 'Switch to Login'}</button>
        </div>
    );
};

export default Auth;
