// OwnerRoutes.js
import OwnerBusDetailPage from '../pages/owner/OwnerBusDetailPage';
import OwnerDashboardPage from '../pages/owner/OwnerDashboardPage';

const OwnerRoutes = [
  { path: '/owner/dashboard', element: <OwnerDashboardPage /> },
  { path: '/owner/buses/:busId', element: <OwnerBusDetailPage />},
];

export default OwnerRoutes;
