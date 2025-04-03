import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

/**
 * A wrapper component for routes that require authentication
 * Redirects to login page if user is not authenticated
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The components to render if authenticated
 * @param {boolean} props.requireOwner - If true, route requires owner role
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({ children, requireOwner = false }) => {
  const { isAuthenticated, isOwner, loading } = useAuth();
  const location = useLocation();

  // Show loader while checking authentication status
  if (loading) {
    return <Loader />;
  }

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If owner access is required but user is not an owner
  if (requireOwner && !isOwner) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated (and is owner if required), render children
  return children;
};

export default ProtectedRoute;