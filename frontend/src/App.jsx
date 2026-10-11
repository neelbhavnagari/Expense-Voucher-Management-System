import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import { ROLE_HOMES } from './utils/constants';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/common/Loader';

// Pages - Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages - Employee
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyVouchers from './pages/employee/MyVouchers';
import CreateVoucher from './pages/employee/CreateVoucher';
import EditVoucher from './pages/employee/EditVoucher';
import EmployeeVoucherDetails from './pages/employee/VoucherDetails';

// Pages - Director
import DirectorDashboard from './pages/director/DirectorDashboard';
import PendingApprovals from './pages/director/PendingApprovals';
import DirectorAllVouchers from './pages/director/AllVouchers';
import ReviewVoucher from './pages/director/ReviewVoucher';

// Pages - Accounts
import AccountsDashboard from './pages/accounts/AccountsDashboard';
import AccountsAllVouchers from './pages/accounts/AllVouchers';
import AccountsVoucherDetails from './pages/accounts/VoucherDetails';

// Not Found
import NotFound from './pages/NotFound';

// Root redirect component
const RootRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Loading EVM System..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={ROLE_HOMES[user.role] || '/login'} replace />;
};

function App() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Employee Protected Routes */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={['Employee']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="vouchers" element={<MyVouchers />} />
        <Route path="vouchers/create" element={<CreateVoucher />} />
        <Route path="vouchers/:id/edit" element={<EditVoucher />} />
        <Route path="vouchers/:id" element={<EmployeeVoucherDetails />} />
      </Route>

      {/* Director Protected Routes */}
      <Route
        path="/director"
        element={
          <ProtectedRoute allowedRoles={['Director']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/director/dashboard" replace />} />
        <Route path="dashboard" element={<DirectorDashboard />} />
        <Route path="approvals/pending" element={<PendingApprovals />} />
        <Route path="vouchers" element={<DirectorAllVouchers />} />
        <Route path="vouchers/:id" element={<ReviewVoucher />} />
        <Route path="review/:id" element={<ReviewVoucher />} />
      </Route>

      {/* Accounts Team Protected Routes */}
      <Route
        path="/accounts"
        element={
          <ProtectedRoute allowedRoles={['Accounts']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/accounts/dashboard" replace />} />
        <Route path="dashboard" element={<AccountsDashboard />} />
        <Route path="vouchers" element={<AccountsAllVouchers />} />
        <Route path="vouchers/:id" element={<AccountsVoucherDetails />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
