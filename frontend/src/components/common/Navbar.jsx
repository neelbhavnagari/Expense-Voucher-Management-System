import React from 'react';
import useAuth from '../../hooks/useAuth';
import { LogOut, User, Menu, Bell, Shield } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Director':
        return 'role-badge-director';
      case 'Accounts':
        return 'role-badge-accounts';
      default:
        return 'role-badge-employee';
    }
  };

  return (
    <header className="app-navbar">
      <div className="navbar-left">
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="brand-logo">
          <div className="brand-icon">EVM</div>
          <div className="brand-text">
            <span className="brand-company">ABC Company</span>
            <span className="brand-system">Expense Voucher System</span>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        {user && (
          <div className="user-profile-widget">
            <div className="user-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <div className="user-meta">
                <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                  {user.role}
                </span>
                {user.department && (
                  <span className="user-department">{user.department}</span>
                )}
              </div>
            </div>

            <button
              onClick={logout}
              className="btn-logout"
              title="Sign Out"
              aria-label="Logout"
            >
              <LogOut size={18} />
              <span className="logout-text">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
