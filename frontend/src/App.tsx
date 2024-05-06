import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as ROUTES from '../src/Constants/routes';
import TestComponent from './Components/TestComponent/dbtest';
import Register from './Pages/Register/Register';
import Login from './Pages/Login/Login';
import Navbar from './Components/Navbar/Navbar';
import ErrorPage from './Pages/ErrorPage/ErrorPage';

function App() {
    return (
      <Router>
        <div id='root'>
          <Navbar />
          <main>
            <Routes>
              <Route path={ROUTES.LANDING} element={<TestComponent />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    );
};

export default App;