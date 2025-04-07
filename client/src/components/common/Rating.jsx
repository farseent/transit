import React from 'react';

const Rating = ({ value, onChange, readOnly = false, size = 'md' }) => {
  const stars = 5;
  const ratingValue = Math.round(value * 2) / 2; // Round to nearest 0.5
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };
  
  const handleClick = (newValue) => {
    if (!readOnly && onChange) {
      onChange(newValue);
    }
  };
  
  // SVG for full star
  const fullStar = (size) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={sizeClasses[size]}
    >
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
  );
  
  // SVG for half star
  const halfStar = (size) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      className={sizeClasses[size]}
    >
      <defs>
        <linearGradient id="halfGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path 
        fillRule="evenodd" 
        fill="url(#halfGradient)" 
        stroke="currentColor" 
        strokeWidth="1"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
        clipRule="evenodd" 
      />
    </svg>
  );
  
  // SVG for empty star
  const emptyStar = (size) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      className={sizeClasses[size]}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
  
  return (
    <div className="flex items-center">
      {[...Array(stars)].map((_, i) => {
        const starValue = i + 1;
        return (
          <span
            key={i}
            onClick={() => handleClick(starValue)}
            className={`text-warning mr-1 ${readOnly ? '' : 'cursor-pointer'}`}
            role={!readOnly ? "button" : undefined}
            aria-label={!readOnly ? `Rate ${starValue} out of ${stars}` : undefined}
          >
            {ratingValue >= starValue ? (
              fullStar(size)
            ) : ratingValue >= starValue - 0.5 ? (
              halfStar(size)
            ) : (
              <span className="text-secondary-300">
                {emptyStar(size)}
              </span>
            )}
          </span>
        );
      })}
      {!readOnly && (
        <span className={`ml-2 ${textSizeClasses[size]} text-gray-600`}>
          {ratingValue > 0 ? `${ratingValue} out of ${stars}` : 'Not rated'}
        </span>
      )}
    </div>
  );
};

export default Rating;