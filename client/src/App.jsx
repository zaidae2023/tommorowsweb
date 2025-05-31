import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import Dashboard from './pages/dashboard';
import AddVehicle from './pages/addvehicle';
import Vehicles from './pages/vehicles';
import Expenses from './pages/expenses';
import Services from './pages/services';
import Settings from './pages/settings';
import Footer from './components/footer';
import { UserProvider } from './context/usercontext.jsx';
import Documents from './pages/Documents'; 
import Upgrade from './pages/Upgrade';
import OAuthSuccess from './pages/OAuthSuccess';
import Success from './pages/Success'; // ✅ Import the Success page
import Cancel from './pages/Cancel'; // ✅ Add this import



// ✅ Import based on actual filenames
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import HelpSupport from './pages/HelpSupport';

function AppRoutes() {
  const location = useLocation();
  const hideFooterPaths = ['/login', '/register', '/forgot-password', '/verify-otp'];
  const showFooter = !hideFooterPaths.includes(location.pathname);

  return (
    <>
      <div className="auth-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/services" element={<Services />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/success" element={<Success />} /> {/* ✅ Add this */}
          <Route path="/cancel" element={<Cancel />} /> // ✅ Add this route
          


          {/* ✅ Footer Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/help" element={<HelpSupport />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;
