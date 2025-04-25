import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

interface PrivateRouteProps {
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, showLoginSheet } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-plum/5 to-white">
        <div className="w-10 h-10 border-4 border-plum/30 border-t-plum rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated after loading is complete, show login sheet and render auth required message
  if (!isLoading && !isAuthenticated) {
    // Show login sheet
    showLoginSheet();
    
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-plum/5 to-white p-4">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to access this page</p>
        </div>
        <button 
          onClick={showLoginSheet}
          className="px-6 py-2 bg-plum text-white rounded-lg font-medium hover:bg-plum/90 transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  // If authenticated, render the children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
