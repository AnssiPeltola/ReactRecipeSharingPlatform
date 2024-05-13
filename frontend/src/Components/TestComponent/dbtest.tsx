import React, { useState, useEffect } from 'react';

function TestComponent() {
    const [message, setMessage] = useState('');

    // useEffect(() => {
    //     fetch('http://localhost:3000/test') // Ensure the URL matches your backend server address and port
    //         .then(response => response.json())
    //         .then(data => setMessage(data.message))
    //         .catch(error => console.error('Error fetching data: ', error));
    // }, []);

    return (
        <div>
            <p>Testisivu</p>
        </div>
    );
}

export default TestComponent;
