import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/UserDashboard.css'; // Importing CSS for styles
import TabletSlider from './TabletSlider';

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState({});
  const [userId, setUserId] = useState(null);
  const [category, setCategory] = useState('');
  const [isCategorySearch, setIsCategorySearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get('https://ecommerce-8m77.onrender.com/cart/check-session', { withCredentials: true });
        const { userId } = response.data;
        sessionStorage.setItem('userId', userId);
        setUserId(userId);
      } catch (err) {
       
        navigate('/userdashboard');
      }
    };

    fetchUserId();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://ecommerce-8m77.onrender.com/get-product');
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

  const fetchProductsByCategory = async () => {
    if (!category.trim()) {
      fetchProducts();
      setIsCategorySearch(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://ecommerce-8m77.onrender.com/product/category', {
        category,
      });
      setFilteredProducts(response.data.products);
      setIsCategorySearch(true);
    } catch (err) {
      setError('Failed to fetch products by category');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    navigate('/userlogin');
  };

  const handleAddToCart = async (productId, quantity) => {
    if (!userId) {
      alert('Please login first');
      return;
    }

    try {
      const response = await axios.post('https://ecommerce-8m77.onrender.com/cart/addtocart', {
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

  const handleQuantityChange = (e, productId) => {
    const quantity = parseInt(e.target.value);
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  const handleUpdateQuantity = async (productId) => {
    const quantity = quantities[productId] || 1;
    try {
      const response = await axios.put('https://ecommerce-8m77.onrender.com/cart/update-quantity', {
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

  const handleDeleteFromCart = async (productId) => {
    if (!userId) {
      alert('Please login first');
      return;
    }

    try {
      const response = await axios.post('https://ecommerce-8m77.onrender.com/cart/delete-items', {
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
      {/* Scrolling Headline in Colored Box */}
      <div className="scrolling-headline-box">
        <marquee>Welcome to the Ultimate Clothing Store: Mytalorzone by Sahiba</marquee>
      </div>

      {/* Navigation Bar */}
      <div className="navigation">
        <nav className="navbar navbar-expand-lg bg-body-primary" style={{ backgroundColor: '#89A8B2' }}>
          <div className="container-fluid">
            <a className="navbar-brand" href="#">Mytalorzone</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Products</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Pricing</a>
                </li>
                
              </ul>
            </div>
          </div>
        </nav>
      </div>
      {/* Category Search */}
      <section className="category-search">
        <input
          type="text"
          placeholder="Search by category (e.g., Books, Stationery)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-input"
        />
        <button onClick={fetchProductsByCategory} className="search-button">Search</button> 
       
        
        <button className="go-to-cart-button" onClick={handleGoToCart}>Go to Cart</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      
      </section>

      {/* Background Color and Diagonal Clip */}
      <div className="background-section">
        <div className="content-text">
        
        </div>
      </div>
      

      {/* Tablet Slider on the Right */}
      <TabletSlider className="tablet-slider" />

      {/* Products Section */}
      <section className="products-section">
        <h2>{isCategorySearch ? `Products in "${category}"` : ''}</h2>
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
                <p style={{textAlign:"left"}}> Quantity : 
                <input
                  type="number"
                  min="1"
                  value={quantities[product.productId] || 1}
                  onChange={(e) => handleQuantityChange(e, product.productId)}
                  className="quantity-input"
                /></p>

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

      
     
      {/* Footer Section */}
<footer className="footer">
  <div className="footer-content">
    <p>&copy; 2024 Mytalorzone by Sahiba. All rights reserved.</p>
    <div className="footer-links">
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Contact Us</a>
    </div>
  </div>
</footer>

    </div>

  );
};

export default UserDashboard;
