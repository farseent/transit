// src/components/protected/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

/**
 * A wrapper component for routes that require authentication and specific roles
 * Redirects to login page if user is not authenticated
 * Redirects to unauthorized page if user doesn't have required role
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The components to render if authorized
 * @param {Array<string>} [props.allowedRoles] - Array of allowed roles (e.g., ['user', 'owner'])
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loader while checking authentication status
  if (loading) {
    return <Loader />;
  }

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if route requires specific roles and user has one of them
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.includes(user?.role);
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated and has required role (if specified), render children
  return children;
};

export default ProtectedRoute;