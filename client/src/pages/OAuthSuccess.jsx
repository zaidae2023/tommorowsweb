import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const email = query.get('email');

    if (token && email) {
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email);

      // ✅ Replace the current URL so `/oauth-success` is not visible in history
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login');
    }
  }, [navigate, location.search]);

  return null; // Nothing is shown
}
