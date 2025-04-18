// src/components/protected/OwnerProtectedRoute.jsx
import { Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const OwnerProtectedRoute = ({ children }) => {
  return <ProtectedRoute allowedRoles={['owner']}><Outlet />{children}</ProtectedRoute>;
};

export default OwnerProtectedRoute;
