import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterDetails() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('sessionToken');
    console.log(token);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/register-details`, { firstname, lastname }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    axios.get('/checkAuthentication', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setIsLoggedIn(response.data.loggedIn);
        console.log('Authentication status:', response.data.loggedIn ? 'Logged in' : 'Not logged in')
      })
      .catch(error => {
        console.error('Error checking authentication status:', error);
      });
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="First Name" required />
      <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Last Name" required />
      <button type="submit">Complete Registration</button>
    </form>
  );
}

export default RegisterDetails;