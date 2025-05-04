import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, User, LogOut, Grid, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Check user role
  const isOwner = user?.role === 'owner';
  
  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      setIsMenuOpen(false);
      navigate('/');
    }
  };

  return (
    <nav className="bg-primary-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <span className="hidden sm:inline">Transit Hub</span>
          <span className="sm:hidden">TH</span>
        </Link>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="text-white focus:outline-none p-1 rounded-md hover:bg-primary-600"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Show navigation based on authentication status and role */}
          {isAuthenticated ? (
            <>
              {/* Common links for authenticated users */}
              {!isOwner && (
                <>
                  <Link 
                    to="/" 
                    className="hover:text-primary-100 transition duration-300 flex items-center gap-2"
                  >
                    <Home size={18} />
                    <span>Home</span>
                  </Link>
                  <Link 
                    to="/profile" 
                    className="hover:text-primary-100 transition duration-300 flex items-center gap-2"
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                </>
              )}
              
              {/* Owner-specific links */}
              {isOwner && (
                <Link 
                  to="/owner/dashboard" 
                  className="hover:text-primary-100 transition duration-300 flex items-center gap-2"
                >
                  <Grid size={18} />
                  <span>Dashboard</span>
                </Link>
              )}
              
              {/* Logout button */}
              <button 
                onClick={handleLogout}
                className="bg-danger hover:bg-danger-600 px-4 py-2 rounded-md transition duration-300 flex items-center gap-2 ml-4"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              {/* Non-authenticated user links */}
              <Link 
                to="/" 
                className="hover:text-primary-100 transition duration-300"
              >
                Home
              </Link>
              <Link 
                to="/login" 
                className="hover:text-primary-100 transition duration-300"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md transition duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-primary-500 md:hidden z-50 shadow-lg">
            <div className="flex flex-col p-4 space-y-3">
              {isAuthenticated ? (
                <>
                  {/* Authenticated mobile navigation */}
                  {!isOwner && (
                    <>
                      <Link 
                        to="/" 
                        className="hover:bg-primary-600 px-3 py-2 rounded transition duration-300 flex items-center gap-3"
                        onClick={toggleMenu}
                      >
                        <Home size={18} />
                        <span>Home</span>
                      </Link>
                      <Link 
                        to="/profile" 
                        className="hover:bg-primary-600 px-3 py-2 rounded transition duration-300 flex items-center gap-3"
                        onClick={toggleMenu}
                      >
                        <User size={18} />
                        <span>Profile</span>
                      </Link>
                    </>
                  )}
                  
                  {/* Owner-specific mobile navigation */}
                  {isOwner && (
                    <Link 
                      to="/owner/dashboard" 
                      className="hover:bg-primary-600 px-3 py-2 rounded transition duration-300 flex items-center gap-3"
                      onClick={toggleMenu}
                    >
                      <Grid size={18} />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  
                  {/* Mobile logout button */}
                  <button 
                    onClick={handleLogout}
                    className="bg-danger hover:bg-danger-600 px-3 py-2 rounded transition duration-300 text-left flex items-center gap-3 mt-2"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Non-authenticated mobile navigation */}
                  <Link 
                    to="/" 
                    className="hover:bg-primary-600 px-3 py-2 rounded transition duration-300"
                    onClick={toggleMenu}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/login" 
                    className="hover:bg-primary-600 px-3 py-2 rounded transition duration-300"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="hover:bg-primary-600 px-3 py-2 rounded transition duration-300"
                    onClick={toggleMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;