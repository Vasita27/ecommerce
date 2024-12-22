import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/UserDashboard.css';

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // For category search
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState({});
  const [userId, setUserId] = useState(null);
  const [category, setCategory] = useState('');
  const [isCategorySearch, setIsCategorySearch] = useState(false); // Flag to toggle view
  const navigate = useNavigate();

  // Fetch the userId from the session on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get('http://localhost:5000/cart/check-session', { withCredentials: true });
        const { userId } = response.data;
        sessionStorage.setItem('userId', userId);
        setUserId(userId);
      } catch (err) {
        console.error('User not logged in:', err);
        navigate('/userlogin');
      }
    };

    fetchUserId();
  }, []);

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/get-product');
      setProducts(response.data.products);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products by category
  const fetchProductsByCategory = async () => {
    if (!category.trim()) {
      fetchProducts();
      setIsCategorySearch(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/product/category', {
        category,
      });
      setFilteredProducts(response.data.products);
      setIsCategorySearch(true); // Switch to category view
    } catch (err) {
      setError('Failed to fetch products by category');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    navigate('/login');
  };

  // Add product to cart
  const handleAddToCart = async (productId, quantity) => {
    if (!userId) {
      alert('Please login first');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/cart/addtocart', {
        userId,
        productId,
        quantity,
      });

      if (response.data.success) {
        alert('Product added to cart');
        setCart((prevCart) => ({
          ...prevCart,
          [productId]: true,
        }));
      } else {
        alert('Failed to add product to cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error adding product to cart');
    }
  };

  // Handle quantity change
  const handleQuantityChange = (e, productId) => {
    const quantity = parseInt(e.target.value);
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  // Update product quantity
  const handleUpdateQuantity = async (productId) => {
    const quantity = quantities[productId] || 1;
    try {
      const response = await axios.put('http://localhost:5000/cart/update-quantity', {
        userId,
        productId,
        productQty: quantity,
      });

      if (response.status === 200) {
        alert('Quantity updated successfully');
      } else {
        alert('Failed to update quantity');
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Error updating product quantity');
    }
  };

  // Delete product from cart
  const handleDeleteFromCart = async (productId) => {
    if (!userId) {
      alert('Please login first');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/cart/delete-items', {
        userId,
        productId,
      });

      if (response.status === 200) {
        alert('Product deleted from cart');
        setCart((prevCart) => {
          const updatedCart = { ...prevCart };
          delete updatedCart[productId];
          return updatedCart;
        });
      } else {
        alert('Failed to delete product from cart');
      }
    } catch (err) {
      console.error('Error deleting product from cart:', err);
      alert('Error deleting product from cart');
    }
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <h1>Welcome to the User Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        <button className="go-to-cart-button" onClick={handleGoToCart}>Go to Cart</button>
      </header>

      {/* Category Search Bar */}
      <section className="category-search">
        <input
          type="text"
          placeholder="Search by category (e.g., Books, Stationery)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-input"
        />
        <button onClick={fetchProductsByCategory} className="search-button">Search</button>
      </section>

      {/* Product List */}
      <section className="products-section">
        <h2>{isCategorySearch ? `Products in "${category}"` : 'Available Products'}</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="product-grid">
            {(isCategorySearch ? filteredProducts : products).map((product) => (
              <div key={product.productId} className="product-card">
                <img src={product.img} alt={product.name} className="product-image" />
                <h3 className="product-title">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price}</p>

                <input
                  type="number"
                  min="1"
                  value={quantities[product.productId] || 1}
                  onChange={(e) => handleQuantityChange(e, product.productId)}
                  className="quantity-input"
                />

                <button
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(product.productId, quantities[product.productId] || 1)}
                >
                  Add to Cart
                </button>

                {cart[product.productId] && (
                  <div className="cart-actions">
                    <button className="update-quantity-button" onClick={() => handleUpdateQuantity(product.productId)}>Update Quantity</button>
                    <button className="delete-from-cart-button" onClick={() => handleDeleteFromCart(product.productId)}>Delete from Cart</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
