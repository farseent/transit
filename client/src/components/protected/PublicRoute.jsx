// components/protected/PublicRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Allows public access but restricts logged-in owners
 * @param {React.ReactNode} children
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if  (isAuthenticated && user?.role === "owner")  {
    // If owner tries to visit public page, redirect to owner dashboard
    return <Navigate to="/owner/dashboard" replace />;
  }
  else if (isAuthenticated && user?.role === "admin"){
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Else allow to view the page
  return children;
};

export default PublicRoute;
