import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleSignup = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');

    // Basic validation
    if (!name || !email || !password) {
      setErrorMessage('Name, Email, and Password are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/auth/signup', {
        name,
        email,
        password,
        phone
      });

      if (response.status === 201) {
        setSuccessMessage('User registered successfully!');
        
        // Clear input fields
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');

        // Redirect to User Dashboard
        setTimeout(() => {
          navigate('/userdashboard');
        }, 1000); // Adding a short delay for UX
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
    <div className="signup-container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>User Signup</h2>
      <form onSubmit={handleSignup} style={{ display: 'inline-block', textAlign: 'left' }}>
        <div className="input-group" style={{ marginBottom: '10px' }}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="input-group" style={{ marginBottom: '10px' }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="input-group" style={{ marginBottom: '10px' }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="input-group" style={{ marginBottom: '10px' }}>
          <label>Phone (Optional)</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number (optional)"
          />
        </div>

        {errorMessage && (
          <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="success-message" style={{ color: 'green', marginBottom: '10px' }}>
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          style={{
            backgroundColor: 'blue',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default UserSignup;
