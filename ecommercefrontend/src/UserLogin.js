import React, { useState } from 'react';
import axios from 'axios';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear any previous error message
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Email and Password are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password
      }, {withCredentials: true} );
      console.log(response.data)
      if (response.data.userId) {
        // Redirect to user dashboard or another page after login
        console.log(response.data.userId)
        window.location.href = `/userdashboard`;
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>User Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default UserLogin;
