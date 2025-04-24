import React, { useEffect } from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
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
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;