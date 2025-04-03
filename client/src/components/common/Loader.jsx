import React from 'react';

/**
 * Loading spinner component
 * 
 * @param {Object} props
 * @param {string} props.size - Size of the loader (sm, md, lg)
 * @param {string} props.color - Color of the loader
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactNode}
 */
const Loader = ({ 
  size = 'md', 
  color = 'primary-500', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-transparent border-4 border-${color} ${sizeClasses[size]}`} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;