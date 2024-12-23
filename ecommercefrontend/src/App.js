import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SellerSignup from './SellerSignup';
import reportWebVitals from './reportWebVitals';
import SellerLogin from './SellerLogin';
import UserLogin from './UserLogin';
import UserSignup from './UserSignup';
import AdminDashboard from './AdminDashboard';
import VerifySeller from './VerifySeller';
import UserDashboard from './UserDashboard';
import CreateCoupon from './CreateCoupon';
import CreateProduct from './CreateProduct';
import CartPage from './cartPage';
const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<SellerSignup />} />
          <Route path="/sellerlogin" element={<SellerLogin />} />
          <Route path="/userlogin" element={<UserLogin />} />
          <Route path="/usersignup" element={<UserSignup />} />
          <Route path="/verifyseller" element={<VerifySeller />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/createcoupon" element={<CreateCoupon />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
    </Router>
  );
};

export default App;
