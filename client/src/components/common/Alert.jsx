import React, { useState } from 'react';

const Alert = ({ 
  type = 'info', 
  message, 
  dismissible = true, 
  className = '',
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const types = {
    info: 'bg-info bg-opacity-10 text-info border-info',
    success: 'bg-success bg-opacity-10 text-success border-success',
    warning: 'bg-warning bg-opacity-10 text-warning border-warning',
    error: 'bg-danger bg-opacity-10 text-danger border-danger',
  };
  
  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };
  
  if (!isVisible) return null;
  
  return (
    <div className={`border-l-4 p-4 rounded-md ${types[type]} ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          {typeof message === 'string' ? (
            <p className="text-sm">{message}</p>
          ) : (
            message
          )}
        </div>
        
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={`ml-4 text-${type} focus:outline-none`}
            aria-label="Dismiss"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;