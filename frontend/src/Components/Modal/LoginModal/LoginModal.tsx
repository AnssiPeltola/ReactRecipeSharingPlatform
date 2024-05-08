import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // replace '#root' with the id of your app's root element

function LoginModal({ isOpen, onRequestClose }: { isOpen: boolean; onRequestClose: () => void; }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, { email, password }, { withCredentials: true });
      console.log(response.data);
      if (response.data.message === 'Login successful') {
        localStorage.setItem('sessionToken', response.data.token);
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
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <input type="submit" value="Login" />
      </form>
      <p>{loginStatus}</p>
    </Modal>
  );
}

export default LoginModal;