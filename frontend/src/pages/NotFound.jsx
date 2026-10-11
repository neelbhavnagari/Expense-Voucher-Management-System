import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROLE_HOMES } from '../utils/constants';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  const { user } = useAuth();
  const homePath = user ? ROLE_HOMES[user.role] || '/' : '/login';

  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <div className="not-found-icon">
          <AlertCircle size={48} />
        </div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page or voucher resource you are looking for does not exist or has been moved.</p>
        <Link to={homePath} className="btn btn-primary btn-lg">
          <Home size={18} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
