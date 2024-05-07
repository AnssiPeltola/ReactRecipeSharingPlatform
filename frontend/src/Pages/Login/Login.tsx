import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, { email, password }, { withCredentials: true });
      console.log(response.data); // Here you would typically handle the logged in user data
      if (response.data.message === 'Login successful') {
        window.location.reload();
      } else {
        setLoginStatus('Login failed. Please check your email and password.');
      }
    } catch (error) {
      console.error(error);
      setLoginStatus('Login failed. Please check your email and password.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Login</button>
      </form>
      <p>{loginStatus}</p>
    </div>
  );
}

export default Login;