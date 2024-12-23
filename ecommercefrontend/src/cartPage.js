import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);  // Default to an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [showCoupons, setShowCoupons] = useState(false); // To toggle the coupon list visibility
  const [coupons, setCoupons] = useState([]); // List of available coupons
  const [address, setAddress] = useState(''); // For storing the address input

  // Fetch product details for each productId
  const getProductDetails = async (productId) => {
    try {
      const response = await axios.get(`https://ecommerce-8m77.onrender.com/product/${productId}`);
      return response.data.product;
    } catch (err) {
      console.log(err);
      setError('Failed to find product details');
    }
  };
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % coupons.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + coupons.length) % coupons.length);
  };

  const fetchCartItems = async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      alert('Please login first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://ecommerce-8m77.onrender.com/cart/get-cart', { userId });
      if (response.data.success) {
        const productsInCart = response.data.cart.productsInCart || [];

        // Fetch product details for each product in the cart
        const cartItemsWithDetails = await Promise.all(
  
          productsInCart.map(async (item) => {
            const productDetails = await getProductDetails(item.productId);
            return {
              ...item,
              productName: productDetails.name,
              productImage: productDetails.img,
              productPrice: productDetails.price,
              productCategory: productDetails.category,
            };
          })
        );

        setCartItems(cartItemsWithDetails);
        calculateTotalPrice(cartItemsWithDetails);
      } else {
        setError('No items in cart');
      }
    } catch (err) {
      setError('Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  // Calculate the total price of items in the cart
  const calculateTotalPrice = (cartItems) => {
    const total = cartItems.reduce((acc, item) => acc + item.productPrice * item.productQty, 0);
    setTotalPrice(total);
    setFinalPrice(total); // Initially, the final price is the total price
  };

  // Apply coupon logic
  const applyCoupon = async () => {
    const code = couponCode;  // Ensure this matches the backend's expected 'code'
    try {
      // Send the coupon code to the backend to verify it
      const response = await axios.post("https://ecommerce-8m77.onrender.com/coupon/verify-coupon", { code });
      
      // Check if the coupon is valid
      if (response.data.success) {
        const discountt = (response.data.discountPercentage * totalPrice) / 100;
        const discount_percentage = response.data.discountPercentage;
        setDiscount(discountt);  // Update the discount state
        alert(`Coupon applied successfully! You get a ${discount_percentage}% discount.`);
        setFinalPrice(totalPrice - discountt);
      } else {
        setDiscount(0);  // No discount if coupon is invalid
        alert(response.data.message);  // Display the error message from backend
      }
    } catch (error) {
      // Handle error if the API request fails
      console.error('Error applying coupon:', error);
      alert('Failed to apply coupon. Please try again.');
    }
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      alert('Please login first');
      return;
    }
    if(!address){
      alert('Please select an address');
      return;
    }

    // Get current date and time using JavaScript's Date object
    const currentDate = new Date();
    const date = currentDate.toLocaleDateString(); // Format date as mm/dd/yyyy (or according to your locale)
    const time = currentDate.toLocaleTimeString(); // Format time as hh:mm:ss
    
    // Ensure final price is calculated with the discount
    const orderTotal = finalPrice;

    try {
      const response = await axios.post('https://ecommerce-8m77.onrender.com/cart/place-order', {
        userId,
        date, // Current date
        time, // Current time
        address, // User's delivery address
        price: orderTotal, // Send the final price after discount
        productsOrdered: cartItems.map(item => ({
          productId: item.productId,
          productQty: item.productQty,
        })),
      });

      if (response.status === 200) {
        alert('Order placed successfully!');
        // Clear the cart or redirect to order confirmation page, etc.
        cartItems.forEach((item) => {
          handleDeleteFromCart(item.productId); // Delete the item from cart
        });
        setCartItems([]);
      } else {
        alert('Failed to place order');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Error placing order');
    }
  };

  const handleBack = () => {
    window.location.href = `/userdashboard`;
  };

  // Fetch available coupons (this can be modified to get real coupons from the backend)
  const fetchCoupons = async () => {
    console.log("Fetching coupons...");
    const response = await axios.get("https://ecommerce-8m77.onrender.com/coupon/get-coupon");
    setCoupons(response.data.coupons);
  };

  useEffect(() => {
    fetchCartItems();
    fetchCoupons(); // Fetch coupons on component mount
  }, []);

  const handleUpdateQuantity = async (productId, quantity) => {
    const userId = sessionStorage.getItem('userId');
    try {
      const response = await axios.put('https://ecommerce-8m77.onrender.com/cart/update-quantity', {
        userId,
        productId,
        productQty: quantity,
      });

      if (response.status === 200) {
        alert('Quantity updated successfully');
        fetchCartItems();
      } else {
        alert('Failed to update quantity');
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Error updating quantity');
    }
  };

  const handleDeleteFromCart = async (productId) => {
    const userId = sessionStorage.getItem('userId');
    try {
      const response = await axios.post('https://ecommerce-8m77.onrender.com/cart/delete-items', {
        userId,
        productId,
      });

      if (response.status === 200) {
        alert('Product deleted from cart');
        fetchCartItems();
      } else {
        alert('Failed to delete product from cart');
      }
    } catch (err) {
      console.error('Error deleting product from cart:', err);
      alert('Error deleting product from cart');
    }
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <button onClick={handleBack}>Back to home</button> <br></br> <br></br>
      {loading ? (
        <p>Loading your cart...</p>
      ) : error ? (
        <p>{error}</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-items-grid">
          {cartItems.map((item) => (
            <div key={item.productId} className="cart-item-card">
              <img
                src={item.productImage}
                alt={item.productName}
                className="cart-item-image"
              />
              <h3 className="cart-item-title">{item.productName}</h3>
              <p className="cart-item-description">{item.productCategory}</p>
              <p className="cart-item-price">${(item.productPrice * item.productQty) - discount}</p>

              <div className="cart-item-actions">
                <input
                  type="number"
                  min="1"
                  defaultValue={item.productQty}
                  onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value))}
                  className="cart-item-quantity"
                />
                <button
                  onClick={() => handleDeleteFromCart(item.productId)}
                  className="cart-item-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="coupon-section" style={{margin:"auto"}}>
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="coupon-input"
          style={{ border: '2px solid #1E90FF' , width:"20%",margin:"auto" ,display:"flex",justifyContent:"center"}} // Previous border color for input
        />
        <div className="coupon-buttons" style={{display:"flex",justifyContent:"center"}}>
          <button onClick={applyCoupon} className="apply-coupon-button">
            Apply Coupon
          </button>
          <button
            onClick={() => setShowCoupons(!showCoupons)}
            className="view-coupons-button"
          >
            View Coupons
          </button>
        </div>
      </div>

      {showCoupons && (
        <div className="coupons-list">
          
          <div className="coupon-cards">
          <div className="success-stories-container">
      
      <div className="carousel">
        <div className="carousel-cards">
          {coupons.map((card, index) => {
            let position = '';
            if (index === (currentIndex + 1) % coupons.length) {
              position = 'right'; // The next card
            } else if (index === currentIndex) {
              position = 'center'; // The current card
            } else if (index === (currentIndex - 1 + coupons.length) % coupons.length) {
              position = 'left'; // The previous card
            } else {
              position = 'hidden'; // Cards not in view
            }

            return (
              <div key={index} className={`card  ${position}`}>
                {index === currentIndex && (
                  <>
                    <button className={`carousel-button left`} onClick={nextSlide}>
                      <div className={`left`}>&lt;</div>
                    </button>
                    <div className="card-content">
                      <div className="card-image">
                        <img src="https://cdn-icons-png.freepik.com/512/6133/6133253.png" alt={card.code} />
                      </div>
                      <div className={`card-info`}>
                        <h3>{card.code}</h3>
                        <p style={{padding:"10px"}} className={`content`}>Discount Percentage: {card.discountPercentage}</p>
                      </div>
                    </div>
                    <button className={`carousel-button right`} onClick={nextSlide}>
                      <div className={`right`}>&gt;</div>
                    </button>
                  </>
                )}
                {index !== currentIndex && (
                  <div className="card-content">
                    <div className="card-image">
                      <img src="https://cdn-icons-png.freepik.com/512/6133/6133253.png" alt={card.title} />
                    </div>
                    <div className="card-info">
                      <h3>{card.code}</h3>
                      <p>Discount Percentage: {card.discountPercentage}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
          </div>
        </div>
      )}

      <div className="address-section">
        <input
          type="text"
          placeholder="Enter your delivery address"
          value={address}
          required="true"
          onChange={(e) => setAddress(e.target.value)}
          className="address-input"
        />
      </div>

      <div className="order-summary">
        <p>Total Price: ${totalPrice.toFixed(2)}</p>
        {discount > 0 && <p>Discount: ${discount.toFixed(2)}</p>}
        <p>Final Price: ${finalPrice.toFixed(2)}</p>
      </div>

      <div className="order-actions">
        <button onClick={handlePlaceOrder} className="order-button">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CartPage;
