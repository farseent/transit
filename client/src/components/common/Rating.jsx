import React from 'react';

const Rating = ({ value, onChange, readOnly = false, size = 'md' }) => {
  const stars = 5;
  const ratingValue = Math.round(value * 2) / 2; // Round to nearest 0.5
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };
  
  const handleClick = (newValue) => {
    if (!readOnly && onChange) {
      onChange(newValue);
    }
  };
  
  return (
    <div className={`flex ${readOnly ? '' : 'cursor-pointer'}`}>
      {[...Array(stars)].map((_, i) => {
        const starValue = i + 1;
        return (
          <span
            key={i}
            onClick={() => handleClick(starValue)}
            className={`${sizeClasses[size]} ${readOnly ? '' : 'cursor-pointer'}`}
          >
            {ratingValue >= starValue ? (
              <span className="text-warning">★</span>
            ) : ratingValue >= starValue - 0.5 ? (
              <span className="text-warning">⋆</span>
            ) : (
              <span className="text-secondary-300">☆</span>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Rating;