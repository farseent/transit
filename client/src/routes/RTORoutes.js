import RTOComplaintDetailPage from '../pages/rto/RTOComplaintDetailPage';
import RTOComplaintsPage from '../pages/rto/RTOComplaintsPage';
import RTODashboardPage from '../pages/rto/RTODashboardPage';

const RTORoutes = [
    { path: '/rto/dashboard', element: <RTODashboardPage /> },
    { path: '/rto/complaints', element: <RTOComplaintsPage /> },
    { path: '/rto/complaints/:id', element: <RTOComplaintDetailPage />}
]

export default RTORoutes;