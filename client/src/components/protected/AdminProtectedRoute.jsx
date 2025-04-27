// src/components/protected/AdminProtectedRoute.jsx

import ProtectedRoute from "./ProtectedRoute";
import { Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <Outlet />
        </ProtectedRoute>
    );
}

export default AdminProtectedRoute;
