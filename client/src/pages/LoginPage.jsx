import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import Alert from '../components/common/Alert';

const LoginPage = () => {
  const location = useLocation();
  const message = location.state?.message;

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