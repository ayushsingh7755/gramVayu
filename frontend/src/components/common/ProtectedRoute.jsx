import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSkeleton } from './LoadingSkeleton';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const fallbackPath =
      user.role === 'admin'
        ? '/admin/dashboard'
        : user.role === 'officer'
        ? '/officer/dashboard'
        : '/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};
