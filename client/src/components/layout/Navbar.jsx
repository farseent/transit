import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Force re-render when location changes (user navigates)
  // This helps update the navbar after login/register redirects
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Search Buses', path: '/buses' },
  ];

  // Make sure to use the current isAuthenticated value
  const authMenuItems = isAuthenticated 
    ? [
        { name: 'Profile', path: '/profile' },
        user?.role === 'owner' && { name: 'Owner Dashboard', path: '/owner-dashboard' }
      ].filter(Boolean)
    : [
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
      ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };


  return (
    <nav className="bg-primary-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Transit Hub
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMenuOpen 
                  ? "M6 18L18 6M6 6l12 12" 
                  : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex space-x-4">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className="hover:text-primary-100 transition duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="flex space-x-4">
            {authMenuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className="hover:text-primary-100 transition duration-300"
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated && (
              <button 
                onClick={handleLogout}
                className="bg-danger hover:bg-danger-600 px-3 py-1 rounded transition duration-300"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-primary-500 md:hidden z-50">
            <div className="flex flex-col px-4 py-4 space-y-3">
              {[...menuItems, ...authMenuItems].map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className="hover:bg-primary-600 px-3 py-2 rounded transition duration-300"
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated && (
                <button 
                  onClick={handleLogout}
                  className="bg-danger hover:bg-danger-600 px-3 py-2 rounded transition duration-300 text-left"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;