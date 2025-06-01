import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OAuthSuccess() {
  const navigate = useNavigate(); // Used to navigate programmatically
  const location = useLocation(); // Used to access the current URL

  useEffect(() => {
    // Extract token and email from the URL query parameters
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const email = query.get('email');

    if (token && email) {
      // Store token and email in localStorage for later use
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email);

      // Navigate to dashboard and replace current URL in browser history
      navigate('/dashboard', { replace: true });
    } else {
      // If token or email is missing, redirect to login
      navigate('/login');
    }
  }, [navigate, location.search]);

  // This page does not display any content
  return null;
}
