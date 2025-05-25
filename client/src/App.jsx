import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import Dashboard from './pages/dashboard';
import AddVehicle from './pages/addvehicle';
import Vehicles from './pages/vehicles'; // ✅ New import for vehicle list page
import { UserProvider } from './context/usercontext.jsx';
import Expenses from './pages/expenses';
import Services from './pages/services'; // ✅ Make sure path is correct

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="auth-container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-vehicle" element={<AddVehicle />} />
            <Route path="/vehicles" element={<Vehicles />} /> {/* ✅ Vehicles list route */}
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/services" element={<Services />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
