import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12 bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Unauthorized Access</h1>
        <p className="text-lg text-gray-600 mb-8">
          You don't have permission to access this page.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button as={Link} to="/" variant="primary">
            Go to Home
          </Button>
          <Button as={Link} to="/profile" variant="outline">
            Go to Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;