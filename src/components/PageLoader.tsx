import React from 'react';

interface PageLoaderProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  overlay?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = 'Loading...', 
  size = 'medium',
  overlay = false
}) => {
  const spinnerSizes = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-4',
    large: 'w-14 h-14 border-4'
  };
  
  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };
  
  const containerClasses = overlay 
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center' 
    : 'flex flex-col items-center justify-center py-12';
  
  return (
    <div className={containerClasses}>
      <div className={`${spinnerSizes[size]} border-plum/30 border-t-plum rounded-full animate-spin mb-4`}></div>
      {message && (
        <p className={`${textSizes[size]} text-gray-600 font-medium`}>{message}</p>
      )}
    </div>
  );
};

export default PageLoader;
