//  React and routing imports
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Page imports
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
import Documents from './pages/Documents';
import Upgrade from './pages/Upgrade';
import OAuthSuccess from './pages/OAuthSuccess';
import Success from './pages/Success'; //  Payment success page
import Cancel from './pages/Cancel';   //  Payment cancel page

//  Footer component
import Footer from './components/footer';

// Context for global user state
import { UserProvider } from './context/usercontext.jsx';

// Footer pages
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import HelpSupport from './pages/HelpSupport';

//  Handles all route definitions and footer visibility
function AppRoutes() {
  const location = useLocation();

  // Paths where the footer should be hidden (auth pages)
  const hideFooterPaths = ['/login', '/register', '/forgot-password', '/verify-otp'];

  // If current path is not in hideFooterPaths, show the footer
  const showFooter = !hideFooterPaths.includes(location.pathname);

  return (
    <>
      <div className="auth-container">
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/*  Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/*  Main app pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/services" element={<Services />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/success" element={<Success />} />     {/*  Stripe success */}
          <Route path="/cancel" element={<Cancel />} />       {/*  Stripe cancel */}

          {/*  Footer-only pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/help" element={<HelpSupport />} />
        </Routes>
      </div>

      {/*  Show footer only on allowed pages */}
      {showFooter && <Footer />}
    </>
  );
}

//  Wrap app in Router and UserProvider (for global user state)
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
