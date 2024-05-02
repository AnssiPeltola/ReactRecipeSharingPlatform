import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== rePassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/register`, { email, password });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <input type="password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} placeholder="Re-enter Password" required />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;