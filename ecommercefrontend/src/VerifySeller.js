import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
 // Scoped CSS for VerifySeller

const VerifySeller = () => {
  const [sellerId, setSellerId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize the navigate function

  // Handle input change
  const handleChange = (e) => {
    setSellerId(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/admin/verify-seller', { sellerId });
      
      if (response.data.success) {
        setSuccess('Seller ID is valid.');
        // Redirect to the admin dashboard on success
        navigate('/admindashboard'); // Adjust the path if needed
      } else {
        setError(response.data.message || 'Invalid seller ID.');
      }
    } catch (err) {
      setError('An error occurred while verifying the seller ID');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verifySellerContainer">
      <h2>Verify Seller ID</h2>
      {error && <p className="errorMessage">{error}</p>}
      {success && <p className="successMessage">{success}</p>}
      
      <form onSubmit={handleSubmit} className="verifyForm">
        <input
          type="text"
          name="sellerId"
          placeholder="Enter your Seller ID"
          value={sellerId}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Seller ID'}
        </button>
      </form>
    </div>
  );
};

export default VerifySeller;
