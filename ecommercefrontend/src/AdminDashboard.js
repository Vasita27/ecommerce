import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./styles/AdminDashboard.css"
const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [isDeleteCouponClicked, setIsDeleteCouponClicked] = useState(false);
  const [products, setProducts] = useState([]); // State for storing fetched products
  const [users, setUsers] = useState([]); // State for storing fetched users
  const [stockUpdate, setStockUpdate] = useState({}); // State to track stock updates for products
  const navigate = useNavigate(); // Initialize navigate hook

  // Logout handler function
  const handleLogout = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('https://ecommerce-8m77.onrender.com/admin/logout', {}, { withCredentials: true });

      if (response.data.success) {
        setSuccess('Logout successful!');

        setTimeout(() => {
          navigate('/sellerlogin'); // Navigate to login page after successful logout
        }, 500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error logging out');
    } finally {
      setLoading(false);
    }
  };

  // Handler functions for other admin tasks
  const handleGenerateCoupon = () => {
    navigate('/createcoupon'); // Navigate to the Create Coupon page
  };

  const handleDeleteCoupon = async () => {
    if (!couponCode || !discountPercentage) {
      alert('Please enter both coupon code and discount percentage.');
      return;
    }

    try {
      const response = await axios.delete('https://ecommerce-8m77.onrender.com/coupon/delete-coupon', {
        data: { code: couponCode, discountPercentage }
      }, { withCredentials: true });

      alert('Coupon Deleted Successfully!');
      setCouponCode('');
      setDiscountPercentage('');
      setIsDeleteCouponClicked(false);
    } catch (err) {
      alert('Error Deleting Coupon');
    }
  };

  const handleCreateProduct = () => {
    navigate('/create-product'); // Navigate to the Create Product page
  };

  const handleAssignProduct = () => {
    navigate('/assign-product'); // Navigate to the Assign Product page
  };

  const handleGetOrders = () => {
    navigate('/orders'); // Navigate to the Orders page
  };

  const handleGetUserDetails = () => {
    navigate('/user-details'); // Navigate to the User Details page
  };

  // Fetch all products
  const handleGetAllProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://ecommerce-8m77.onrender.com/get-product', { withCredentials: true });
      setProducts(response.data.products); // Assuming 'products' array is in response data
    } catch (err) {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users
  const handleGetUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://ecommerce-8m77.onrender.com/get-user', { withCredentials: true });
      setUsers(response.data.users); // Assuming 'users' array is in response data
    } catch (err) {
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  // Handle stock update (increment/decrement)
  const handleStockUpdate = async (productId, updateValue) => {
    if (updateValue === 0) return; // Do nothing if the input value is 0
    const productToUpdate = products.find((product) => product.productId === productId);
    if (!productToUpdate) return; // If product not found, return

    // Prepare data for the API request
    const { price, name, category, inStockValue, soldStockValue } = productToUpdate;
    const updatedStock = inStockValue + updateValue; // Update stock by the entered value

    try {
      setLoading(true);
      const response = await axios.put(
        'https://ecommerce-8m77.onrender.com/instock-update',
        {
          productId,
          price,
          name,
          category,
          inStockValue: updatedStock,
          soldStockValue
        },
        { withCredentials: true }
      );

      setSuccess('Stock updated successfully!');
      handleGetAllProducts(); // Refresh the product list after updating stock
    } catch (err) {
      setError('Error updating stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '50px' }}>
      <h1>Welcome to the Admin Dashboard</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div style={{ marginTop: '30px' }}>
        {/* Coupon Management */}
        <h3>Coupon Management</h3>
        <button onClick={handleGenerateCoupon} style={buttonStyle}>Generate Coupon</button>
        <button onClick={() => setIsDeleteCouponClicked(!isDeleteCouponClicked)} style={{ ...buttonStyle, backgroundColor: 'red' }}>
          Delete Coupon
        </button>

        {/* Show input fields for deleting coupon only if the button is clicked */}
        {isDeleteCouponClicked && (
          <div>
            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Enter Discount Percentage"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              style={inputStyle}
            />
            <button onClick={handleDeleteCoupon} style={{ ...buttonStyle, backgroundColor: 'red' }}>
              Confirm Delete Coupon
            </button>
          </div>
        )}

        {/* Product Management */}
        <h3>Product Management</h3>
        <button onClick={handleCreateProduct} style={buttonStyle}>Create Product</button>
        

        {/* Get All Products */}
        <h3>View All Products</h3>
        <button onClick={handleGetAllProducts} style={buttonStyle} disabled={loading}>
          {loading ? 'Loading Products...' : 'Get All Products'}
        </button>

        {/* Display Products in Cards */}
        <div style={productsContainerStyle}>
          {products.map((product) => (
            <div key={product.productId} style={cardStyle}>
              <img src={product.img} alt={product.name} style={imgStyle} />
              <div style={cardContentStyle}>
                <h3>{product.name}</h3>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Rating:</strong> {product.rating}</p>
                <p><strong>In Stock:</strong> {product.inStockValue}</p>

                {/* Input field for updating stock */}
                <input
                  type="number"
                  placeholder="Stock Update"
                  value={stockUpdate[product.productId] || ''}
                  onChange={(e) => setStockUpdate({ ...stockUpdate, [product.productId]: e.target.value })}
                  style={inputStyle}
                />
                <button
                  onClick={() => handleStockUpdate(product.productId, parseInt(stockUpdate[product.productId] || 0))}
                  style={buttonStyle}
                >
                  Update Stock
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Get Users */}
        <h3>View All Users</h3>
        <button onClick={handleGetUsers} style={buttonStyle} disabled={loading}>
          {loading ? 'Loading Users...' : 'Get All Users'}
        </button>

        {/* Display Users */}
        <div style={{ marginTop: '30px' }}>
          {users.map((user) => (
            <div key={user._id} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          ))}
        </div>

        {/* Orders and User Details */}
        
      </div>

      {/* Logout Button */}
      <div style={{ marginTop: '50px' }}>
        <button onClick={handleLogout} disabled={loading} style={{ ...buttonStyle, backgroundColor: 'red' }}>
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

// Simple Button Styles
const buttonStyle = {
  margin: '10px',
  padding: '10px 20px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: 'blue',
  color: 'white',
  fontSize: '14px',
};

// Input field styles
const inputStyle = {
  margin: '10px',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '14px',
  width: '200px',
};

// Styles for displaying products in cards
const productsContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '20px',
  marginTop: '30px',
};

const cardStyle = {
  width: '250px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  textAlign: 'center',
};

const imgStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
};

const cardContentStyle = {
  padding: '15px',
  fontSize: '14px',
  backgroundColor: '#f9f9f9',
};

export default AdminDashboard;
