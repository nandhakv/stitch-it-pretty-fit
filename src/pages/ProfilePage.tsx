import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  LogOut, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight,
  ShoppingBag,
  Heart,
  Settings,
  HelpCircle,
  Edit
} from 'lucide-react';
import { useAuth } from '../utils/AuthContext';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, firebaseUser, logout, isAuthenticated, isLoading, showLoginSheet } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Redirect to login if not authenticated, but only after loading is complete
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      showLoginSheet();
      navigate(-1); // Go back to previous page
    }
  }, [isAuthenticated, isLoading, navigate, showLoginSheet]);
  
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/');
    }
  };
  
  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-plum/5 to-white">
        <div className="w-10 h-10 border-4 border-plum/30 border-t-plum rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect to login
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-plum/5 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm py-4 px-4">
        <h1 className="text-lg font-semibold">My Profile</h1>
      </div>
      
      {/* Main content */}
      <div className="flex-1 py-6 w-full">
        <div className="w-full px-0 md:container md:mx-auto md:max-w-3xl md:px-4">
        {/* Profile header */}
        <div className="bg-white md:rounded-lg shadow-md p-4 mb-6 mx-0 md:mx-4">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-plum/10 rounded-full flex items-center justify-center text-plum mr-4">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{user.name || 'User'}</h2>
              <p className="text-gray-600 text-sm">+91 {user.phone}</p>
              {user.email && <p className="text-gray-600 text-sm">{user.email}</p>}
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Phone verified
              </p>
            </div>
            <button 
              className="text-plum hover:text-plum/80 p-2"
              onClick={() => navigate('/edit-profile')}
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Account sections */}
        <div className="bg-white md:rounded-lg shadow-md overflow-hidden mb-6 mx-0 md:mx-4">
          <h3 className="text-sm font-medium text-gray-500 px-4 pt-4 pb-2">ACCOUNT</h3>
          
          <div className="divide-y divide-gray-100">
            <Link to="/orders" className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mr-3">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span>My Orders</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            
            <Link to="/addresses" className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600 mr-3">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Saved Addresses</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            
            <Link to="/wishlist" className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center text-red-600 mr-3">
                  <Heart className="w-4 h-4" />
                </div>
                <span>Wishlist</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>
        
        {/* Settings & Support */}
        <div className="bg-white md:rounded-lg shadow-md overflow-hidden mx-0 md:mx-4">
          <h3 className="text-sm font-medium text-gray-500 px-4 pt-4 pb-2">SETTINGS & SUPPORT</h3>
          
          <div className="divide-y divide-gray-100">
            <Link to="/settings" className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 mr-3">
                  <Settings className="w-4 h-4" />
                </div>
                <span>App Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            
            <Link to="/help" className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mr-3">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span>Help & Support</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-between p-4 text-red-600 hover:bg-red-50/80"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center text-red-600 mr-3">
                  <LogOut className="w-4 h-4" />
                </div>
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>
        
        {/* App version */}
        <div className="text-center text-xs text-gray-500 mt-auto mb-4 px-4">
          <p>App Version 1.0.0</p>
        </div>
        </div>
      </div>
      
      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-sm">
            <h3 className="text-lg font-medium mb-2">Logout</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to logout from your account?</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
