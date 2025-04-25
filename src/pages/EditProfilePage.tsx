import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Calendar,
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import PageLoader from '../components/PageLoader';
import { toast } from '@/components/ui/use-toast';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, firebaseUser, updateUserProfile, isAuthenticated, isLoading: authLoading, showLoginSheet } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: ''
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        dob: user.dob || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firebaseUser) {
      setError('You must be logged in to update your profile');
      return;
    }
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!formData.dob) {
      setError('Please enter your date of birth');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Get Firebase ID token
      const firebaseToken = await firebaseUser.getIdToken();
      
      // Call the profile update API
      const response = await fetch('http://localhost:3001/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firebaseToken}`
        },
        body: JSON.stringify({
          name: formData.name,
          dob: formData.dob,
          email: formData.email || undefined
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Profile update failed');
      }
      
      // Update local user data
      await updateUserProfile({
        name: formData.name,
        dob: formData.dob,
        email: formData.email || undefined
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully",
        variant: "default"
      });
      
      // Navigate back to profile page
      navigate('/profile');
      
    } catch (error: any) {
      console.error('Profile update failed:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // The PrivateRoute component now handles authentication loading and redirects

  return (
    <div className="min-h-screen bg-gradient-to-b from-plum/5 to-white flex flex-col">
      {/* Show loader when saving profile */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <PageLoader message="Saving your profile..." size="medium" overlay={true} />
        </div>
      )}
      {/* Header */}
      <div className="bg-white shadow-sm py-4 px-4">
        <h1 className="text-lg font-semibold">Edit Profile</h1>
      </div>
      
      {/* Main content */}
      <div className="flex-1 py-6 w-full">
        <div className="w-full px-4 md:container md:mx-auto md:max-w-md">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg text-red-700 px-4 py-3 mb-6 text-sm flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-white md:rounded-lg shadow-md p-6 mx-0 md:mx-4">
            <div className="flex justify-center mb-2">
              <div className="w-20 h-20 bg-plum/10 rounded-full flex items-center justify-center text-plum">
                <User className="w-10 h-10" />
              </div>
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum focus:border-plum"
                  placeholder="Your full name"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum focus:border-plum"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address (Optional)
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum focus:border-plum"
                  placeholder="your.email@example.com"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">We'll never share your email with anyone else.</p>
            </div>
            
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-medium transition-colors bg-plum hover:bg-plum/90 text-white flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
