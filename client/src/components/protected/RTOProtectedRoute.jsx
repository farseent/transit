// src/components/protected/OwnerProtectedRoute.jsx
import { Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const RTOProtectedRoute = ({ children }) => {
  return <ProtectedRoute allowedRoles={['rto']}><Outlet />{children}</ProtectedRoute>;
};

export default RTOProtectedRoute;
