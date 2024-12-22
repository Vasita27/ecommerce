import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [productId, setProductId] = useState('');
  const [inStockValue, setInStockValue] = useState('');
  const [soldStockValue, setSoldStockValue] = useState('');
  const [visibility, setVisibility] = useState('on');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/create-product', {
        name: productName,
        price,
        img,
        category,
        rating,
        productId,
        inStockValue,
        soldStockValue,
        visibility,
      });

      if (response.data.success) {
        setSuccess('Product created successfully!');
        setTimeout(() => {
          navigate('/admindashboard'); // Redirect to admin dashboard after successful creation
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '50px' }}>
      <h1>Create a New Product</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      
      <form onSubmit={handleCreateProduct} style={{ maxWidth: '500px', margin: 'auto' }}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Image URL"
            value={img}
            onChange={(e) => setImg(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="number"
            placeholder="Rating (1-5)"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="number"
            placeholder="In Stock Value"
            value={inStockValue}
            onChange={(e) => setInStockValue(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="number"
            placeholder="Sold Stock Value"
            value={soldStockValue}
            onChange={(e) => setSoldStockValue(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            style={inputStyle}
          >
            <option value="on">Visible</option>
            <option value="off">Invisible</option>
          </select>
        </div>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Creating Product...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

// Button and input field styles
const buttonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: 'blue',
  color: 'white',
  fontSize: '14px',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  width: '100%',
  fontSize: '14px',
};

export default CreateProduct;
