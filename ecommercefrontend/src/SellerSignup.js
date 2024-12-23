import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom'; // Import useNavigate for redirection
import './styles/SellerSignup.css'; // Scoped CSS for SellerSignup

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
      const response = await axios.post('https://ecommerce-8m77.onrender.com/admin/seller/signup', formData, {
        withCredentials: true, // Ensure that the session cookie is sent
      });

      setSuccess(`Registration successful! Your Seller ID: ${response.data.sellerId}`);
      
      // Redirect to the Admin Dashboard after a short delay
      setTimeout(() => {
        navigate('/admindashboard'); // Redirect to the admin dashboard page
      }, 5000); // Optional delay before redirect (2 seconds)
      
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
      
      <form onSubmit={handleSubmit} className="signupForm">
      {error && <p className="errorMessage">{error}</p>}
      {success && <p className="successMessage">{success}</p>}
      <h2>Seller Signup</h2>
        <input
         className='input-class'
          type="email"
          name="emailId"
          placeholder="Email Address"
          value={formData.emailId}
          onChange={handleChange}
          required
        />
        <input
        className='input-class'
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
         className='input-class'
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
        Already have an admin account? <br></br>
        <Link to="/sellerlogin">Login</Link> <br></br> <br></br>
        Are you a user? <br></br> 
        <Link to="/userlogin">Login as user</Link>
      </form>
    </div>
  );
};

export default SellerSignup;
