import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCoupon = () => {
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!code || !discountPercentage) {
      setError('Coupon code and discount percentage are required.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/coupon/save-coupon',
        { code, discountPercentage },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess('Coupon created successfully!');
        setCode('');
        setDiscountPercentage('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating coupon');
    }
  };

  const handleGoBack = () => {
    navigate('/admindashboard');
  };

  return (
    <div style={containerStyle}>
      <h2>Create Coupon</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleCreateCoupon} style={formStyle}>
        <div>
          <label>Coupon Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter coupon code"
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label>Discount Percentage:</label>
          <input
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            placeholder="Enter discount percentage"
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Create Coupon</button>
      </form>
      <button onClick={handleGoBack} style={{ ...buttonStyle, backgroundColor: 'gray' }}>
        Go Back
      </button>
    </div>
  );
};

// Styles
const containerStyle = {
  textAlign: 'center',
  margin: '50px auto',
  maxWidth: '400px',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  marginBottom: '20px',
};

const inputStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
};

const buttonStyle = {
  padding: '10px 20px',
  margin: '10px 0',
  border: 'none',
  borderRadius: '4px',
  fontSize: '14px',
  cursor: 'pointer',
  backgroundColor: 'blue',
  color: 'white',
};

export default CreateCoupon;
