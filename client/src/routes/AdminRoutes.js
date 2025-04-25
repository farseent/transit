import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import BusManagementPage from '../pages/admin/BusManagementPage';
// import RouteManagementPage from '../pages/admin/RouteManagementPage';
// import SystemSettingsPage from '../pages/admin/SystemSettingsPage';

const AdminRoutes = [
  { path: '/admin/dashboard', element: <AdminDashboardPage />, },
  { path: '/admin/users', element: <UserManagementPage />, },
  { path: '/admin/buses', element: <BusManagementPage />, },
  // { path: 'routes', element: <RouteManagementPage /> },
  // { path: 'settings', element: <SystemSettingsPage />, },
];

export default AdminRoutes;