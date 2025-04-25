// src/components/protected/AdminProtectedRoute.jsx

import ProtectedRoute from "./ProtectedRoute";
import { Outlet } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
    return <ProtectedRoute allowedRoles={['admin']} ><Outlet/> { children } </ProtectedRoute>
}

export default AdminProtectedRoute;