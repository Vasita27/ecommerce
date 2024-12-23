import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import "./styles/UserSignup.css"
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
      const response = await axios.post('https://ecommerce-8m77.onrender.com/auth/signup', {
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
    <div className="signup-container">
      <form onSubmit={handleSignup} >
      <h2>User Signup</h2> <br></br>
        <div className="input-group">
       
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
        className='but'
          type="submit"
        >
          Sign Up
        </button> <br></br> <br></br>
        Already have an account? <br></br>
        <Link to="/userlogin">Login</Link>
      </form>
    </div>
  );
};

export default UserSignup;
