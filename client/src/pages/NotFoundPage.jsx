// src/components/NotFound.jsx
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const NotFound = () => {
  // Optional: Change document title
  useEffect(() => {
    document.title = 'Page Not Found';
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-white p-4">
      <div className="max-w-md w-full text-center">
        {/* Error Code */}
        <h1 className="text-9xl font-bold text-primary-500 mb-4">404</h1>
        
        {/* Error Message */}
        <h2 className="text-3xl font-bold text-secondary-800 mb-2">Page Not Found</h2>
        <p className="text-secondary-500 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Illustration (optional) */}
        <div className="mb-8">
          <svg
            className="w-48 h-48 mx-auto text-primary-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        {/* Action Button */}
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg shadow-md transition duration-300"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;