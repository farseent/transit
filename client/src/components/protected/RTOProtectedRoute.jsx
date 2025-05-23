// src/components/protected/OwnerProtectedRoute.jsx
import { Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const RTOProtectedRoute = () => {
  return <ProtectedRoute allowedRoles={['rto']}><Outlet /></ProtectedRoute>;
};

export default RTOProtectedRoute;
