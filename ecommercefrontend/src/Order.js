import React, { useState } from 'react';
import axios from 'axios';

const PlaceOrder = () => {
  const [orderDetails, setOrderDetails] = useState({
    date: '',
    time: '',
    address: '',
    price: 0,
    productsOrdered: [],
  });
  const [userId, setUserId] = useState(sessionStorage.getItem('userId')); // Assume user is logged in
  const [orderStatus, setOrderStatus] = useState('');

  // Function to get the current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const time = now.toISOString().split('T')[1].split('.')[0]; // Get current time in HH:MM:SS format
    return { date, time };
  };

  // Set the current date and time when the component is mounted
  React.useEffect(() => {
    const { date, time } = getCurrentDateTime();
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      date,
      time,
    }));
  }, []);

  // Function to handle order placement
  const placeOrder = async () => {
    if (!userId) {
      alert('Please log in first');
      return;
    }

    const { date, time, address, price, productsOrdered } = orderDetails;

    // Validate form fields
    if (!address || productsOrdered.length === 0) {
      alert('Please fill in all the required fields');
      return;
    }

    try {
      // Sending the order details to the backend
      const response = await axios.post('http://localhost:5000/order/place-order', {
        userId,
        date,
        time,
        address,
        price,
        productsOrdered,
      });

      if (response.data.success) {
        setOrderStatus(`Order placed successfully! Order ID: ${response.data.orderId}, Tracking ID: ${response.data.trackingId}`);
      } else {
        setOrderStatus('Failed to place the order. Please try again later.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderStatus('Error placing order. Please try again later.');
    }
  };

  // Function to handle input changes for order details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className="place-order-container">
      <h2>Place Your Order</h2>

      <label>
        Date:
        <input
          type="date"
          name="date"
          value={orderDetails.date}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Time:
        <input
          type="time"
          name="time"
          value={orderDetails.time}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Address:
        <textarea
          name="address"
          value={orderDetails.address}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Total Price:
        <input
          type="number"
          name="price"
          value={orderDetails.price}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Products Ordered:
        <input
          type="text"
          name="productsOrdered"
          value={orderDetails.productsOrdered}
          onChange={handleInputChange}
          placeholder="Enter product IDs separated by commas"
        />
      </label>

      <button onClick={placeOrder}>Place Order</button>

      {orderStatus && <p>{orderStatus}</p>}
    </div>
  );
};

export default PlaceOrder;
