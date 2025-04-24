// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { AdminProvider } from './context/AdminContext';
import Layout from './components/layout/Layout';

// Pages 
import HomePage from './pages/HomePage';
import BusListPage from './pages/BusListPage';
import BusDetailPage from './pages/BusDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Protected Route Component
import UserProtectedRoute from './components/protected/UserProtectedRoute';
import OwnerProtectedRoute from './components/protected/OwnerProtectedRoute';
import UserRoutes from './routes/UserRoutes';
import OwnerRoutes from './routes/OwnerRoutes';
import PublicRoute from './components/protected/PublicRoute';

//Adminpages

function App() {
  return (
    <Router>
      <AuthProvider>
        <SearchProvider>
          <AdminProvider>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
              <Route path="/buses" element={<PublicRoute><BusListPage /></PublicRoute>} />
              <Route path="/buses/:id" element={<PublicRoute><BusDetailPage /></PublicRoute>} />

              {/* USER ROUTES */}
              <Route element={<UserProtectedRoute />}>
                {UserRoutes.map(({ path, element }, idx) => (
                  <Route key={idx} path={path} element={element} />
                ))}
              </Route>

              {/* OWNER ROUTES */}
              <Route element={<OwnerProtectedRoute />}>
                {OwnerRoutes.map(({ path, element }, idx) => (
                  <Route key={idx} path={path} element={element} />
                ))}
              </Route>


              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
          </AdminProvider>
        </SearchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;