// OwnerRoutes.js
import OwnerBusDetailPage from '../pages/OwnerBusDetailPage';
import OwnerDashboardPage from '../pages/OwnerDashboardPage';

const OwnerRoutes = [
  { path: '/owner/dashboard', element: <OwnerDashboardPage /> },
  { path: '/owner/buses/:busId', element: <OwnerBusDetailPage />},
];

export default OwnerRoutes;
