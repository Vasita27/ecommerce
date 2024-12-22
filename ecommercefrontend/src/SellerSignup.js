import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './SellerSignup.module.css'; // Scoped CSS for SellerSignup

const SellerSignup = () => {
  const [formData, setFormData] = useState({
    emailId: '',
    password: '',
    phoneNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error messages
    setSuccess(''); // Clear any previous success messages
    setLoading(true);

    try {
      // Send the POST request to the backend with credentials enabled
      const response = await axios.post('http://localhost:5000/admin/seller/signup', formData, {
        withCredentials: true, // Ensure that the session cookie is sent
      });

      setSuccess(`Registration successful! Your Seller ID: ${response.data.sellerId}`);
      
      // Redirect to the Admin Dashboard after a short delay
      setTimeout(() => {
        navigate('/admindashboard'); // Redirect to the admin dashboard page
      }, 2000); // Optional delay before redirect (2 seconds)
      
      // Reset form fields after successful signup
      setFormData({
        emailId: '',
        password: '',
        phoneNumber: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sellerSignupContainer">
      <h2>Seller Signup</h2>
      {error && <p className="errorMessage">{error}</p>}
      {success && <p className="successMessage">{success}</p>}
      <form onSubmit={handleSubmit} className="signupForm">
        <input
          type="email"
          name="emailId"
          placeholder="Email Address"
          value={formData.emailId}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SellerSignup;
