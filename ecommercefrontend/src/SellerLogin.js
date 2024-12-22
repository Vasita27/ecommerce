import React, { useState } from 'react';
import axios from 'axios';

const SellerLogin = () => {
  const [sellerId, setSellerId] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear any previous error message
    setErrorMessage('');

    // Basic validation (make sure fields are not empty)
    if (!sellerId || !emailOrPhone || !password) {
      setErrorMessage('Seller ID, Email/Phone, and Password are required');
      return;
    }

    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:5000/auth/seller/login', {
        sellerId,
        emailOrPhone,
        password
      });

      // If login is successful, you can redirect to another page, e.g., dashboard
      if (response.data.sellerId) {
        // Redirect to dashboard with sellerId
        window.location.href = `/admindashboard`;
      }

    } catch (error) {
      // Handle error
      if (error.response) {
        // If the backend returned a response (e.g., 400, 401)
        setErrorMessage(error.response.data.error);
      } else {
        // If no response was received
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Seller Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Seller ID</label>
          <input
            type="text"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            placeholder="Enter your seller ID"
            required
          />
        </div>

        <div className="input-group">
          <label>Email or Phone</label>
          <input
            type="text"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="Enter your email or phone number"
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

export default SellerLogin;
