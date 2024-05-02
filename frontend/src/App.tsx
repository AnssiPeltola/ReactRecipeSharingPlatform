import React from 'react';
import TestComponent from './Components/TestComponent/dbtest'; // Adjust the path as necessary
import Register from './Pages/Register/Register';
import Login from './Pages/Login/Login';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <TestComponent />
                <Register />
                <Login />
            </header>
        </div>
    );
}

export default App;
