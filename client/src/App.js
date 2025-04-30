// src/App.js
import React from 'react';
import { Routes, Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { AdminProvider } from './context/AdminContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages 
import HomePage from './pages/HomePage';
import BusListPage from './pages/BusListPage';
import BusDetailPage from './pages/BusDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Route Configs
import UserRoutes from './routes/UserRoutes';
import OwnerRoutes from './routes/OwnerRoutes';
import AdminRoutes from './routes/AdminRoutes';

// Protected Route Component
import PublicRoute from './components/protected/PublicRoute';
import UserProtectedRoute from './components/protected/UserProtectedRoute';
import OwnerProtectedRoute from './components/protected/OwnerProtectedRoute';
import AdminProtectedRoute from './components/protected/AdminProtectedRoute';

function App() {
  return (
      <AuthProvider>
        <SearchProvider>
          <AdminProvider>
            <Routes>
              
              {/* Public/User/Owner Layout */}
              <Route element={<Layout />}>
                {/* Public Routes */}
                <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
                <Route path="/buses" element={<PublicRoute><BusListPage /></PublicRoute>} />
                <Route path="/buses/:id" element={<PublicRoute><BusDetailPage /></PublicRoute>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* User Routes */}
                <Route element={<UserProtectedRoute />}>
                  {UserRoutes.map(({ path, element }, idx) => (
                    <Route key={idx} path={path} element={element} />
                  ))}
                </Route>

                {/* Owner Routes */}
                <Route element={<OwnerProtectedRoute />}>
                  {OwnerRoutes.map(({ path, element }, idx) => (
                    <Route key={idx} path={path} element={element} />
                  ))}
                </Route>

                {/* Catch-All for Not Found */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin Layout */}
              <Route element={<AdminLayout />}>
                <Route element={<AdminProtectedRoute />}>
                  {AdminRoutes.map(({ path, element }, idx) => (
                    <Route key={idx} path={path} element={element} />
                  ))}
                </Route>
              </Route>

            </Routes>
          </AdminProvider>
        </SearchProvider>
      </AuthProvider>
  );
}

export default App;