import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./homepage/Homepage";
import Navbar from "./navigation/Navbar";
import SignUp from "./signup/SignUp";
import Login from "./login/Login";
import Cart from "./cart/Cart";
import ProfilePage from "./profile/ProfilePage";
import Footer from "./navigation/Footer.";
import ForgotPasswordPage from "./verifications/ForgotPasswordPage";
import PasswordResetPage from "./verifications/PasswordResetPage";
import MyOrders from "./orders/MyOrders";
import OrderDetails from "./orders/OrderDetails";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-20 pb-8 px-4">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<PasswordResetPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
