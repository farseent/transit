// src/components/protected/UserProtectedRoute.jsx
import { Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const UserProtectedRoute = ({ children }) => {
  return <ProtectedRoute allowedRoles={['user']}><Outlet />{children}</ProtectedRoute>;
};

export default UserProtectedRoute;
