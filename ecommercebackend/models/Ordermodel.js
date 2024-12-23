const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,// Assuming you have a 'User' model for user information
    required: true
  },
  orderId :{
    type: String,
    required: true
  },
  date: {
    type: String, // Store date as a string (you can also use Date type)
    required: true,
  },
  time: {
    type: String, // Store time as a string
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  productsOrdered: [
    {
      productId: {
        type: String,
        required: true,
      },
      productQty: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Orders = mongoose.model('Orders', orderSchema,"new_orders");

module.exports = Orders;
