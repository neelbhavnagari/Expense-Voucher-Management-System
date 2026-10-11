import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-layout-container">
      <div className="auth-layout-bg-glow" />
      <div className="auth-layout-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
