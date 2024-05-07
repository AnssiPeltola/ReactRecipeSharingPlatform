import React, { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.scss';
import axios from 'axios';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get('/checkAuthentication')
      .then(response => {
        setIsLoggedIn(response.data.loggedIn);
        console.log('Authentication status:', response.data.loggedIn ? 'Logged in' : 'Not logged in')
      })
      .catch(error => {
        console.error('Error checking authentication status:', error);
      });
  }, [isLoggedIn]);

  const handleLogout = () => {
    axios.post('/logout')
      .then(response => {
        console.log(response.data.message);
        setIsLoggedIn(false);
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <nav className={styles.nav}>
      <div>Logo</div>
      <ul>
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        ) : (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        )}
        {/* Add more links as needed */}
      </ul>
    </nav>
  );
};

export default Navbar;