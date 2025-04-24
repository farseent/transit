import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import Alert from '../components/common/Alert';
import { useAuth } from '../context/AuthContext'; // adjust the path if needed

const LoginPage = () => {
  const location = useLocation();
  const message = location.state?.message;
  const navigate = useNavigate();
  const { isAuthenticated, isOwner, loading } = useAuth();

  useEffect(() => {
    if (!loading) { // Wait until auth is fully loaded
      if (isAuthenticated) {
        if (isOwner) {
          navigate('/owner/dashboard');
        } else {
          navigate('/');
        }
      }
    }
  }, [isAuthenticated, isOwner, loading, navigate]);


  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        {message && (
          <Alert 
            type="success" 
            message={message} 
            className="mb-6" 
          />
        )}
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;