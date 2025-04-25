import React, { useState, useRef, useEffect } from 'react';
import { X, LogIn, Phone, CheckCircle, AlertCircle, Lock, Scissors, ChevronDown, User, Calendar, Mail } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { useAuth } from '../utils/AuthContext';
import { setupRecaptcha, sendOTP, verifyOTP } from '../utils/firebase';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface LoginBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LoginBottomSheet: React.FC<LoginBottomSheetProps> = ({ isOpen, onClose, onSuccess }) => {
  const { handleSuccessfulAuth } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone');
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    dob: '',
    email: ''
  });
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  
  // Reference for recaptcha container
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }
    
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    try {
      setSendOtpLoading(true);
      setError('');
      
      // Setup recaptcha
      if (!recaptchaContainerRef.current) return;
      
      // Create a new reCAPTCHA verifier
      const appVerifier = setupRecaptcha('recaptcha-container');
      
      // Send OTP
      const result = await sendOTP(phone, appVerifier);
      
      if (result.success) {
        setStep('otp');
        setConfirmationResult(result.confirmationResult);
        toast({
          title: "OTP Sent",
          description: "Verification code has been sent to your phone",
          variant: "default"
        });
      } else if (result.error) {
        setError(result.error.message);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      setError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setSendOtpLoading(false);
    }
  };
  
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    try {
      setVerifyLoading(true);
      setError('');
      
      const result = await verifyOTP(confirmationResult, otp);
      
      if (result.success && result.user) {
        try {
          // Store Firebase user for potential registration step
          setFirebaseUser(result.user);
          
          // Call backend API with Firebase user
          const userData = await authenticateWithBackend(result.user);
          
          // If userData is null, it means we've moved to registration step
          if (userData === null) {
            return; // Don't proceed further, wait for registration
          }
          
          // Update auth context with the user data from your backend
          handleSuccessfulAuth(result.user, userData);
          
          toast({
            title: "Authentication Successful",
            description: "You have been successfully logged in",
            variant: "default"
          });
          
          // Close modal and call success callback
          if (onSuccess) onSuccess();
          onClose();
        } catch (backendError: any) {
          setError(backendError.message || 'Failed to authenticate with server');
        }
      } else if (result.error) {
        setError(result.error.message);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      setError(error.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setVerifyLoading(false);
    }
  };
  
  // Call backend API to verify authentication
  const authenticateWithBackend = async (firebaseUser: FirebaseUser) => {
    try {
      // Get Firebase ID token
      const firebaseToken = await firebaseUser.getIdToken();
      
      // Call your backend API
      const response = await fetch('http://localhost:3001/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firebaseToken,
          phone: `+91${phone}`, // Include country code
          deviceInfo: {
            platform: 'web',
            appVersion: '1.0.0'
          }
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || 'Authentication failed');
      }
      
      // Store the JWT token for future API calls
      localStorage.setItem('authToken', data.data.token);
      if (data.data.refreshToken) {
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }
      
      // Check if this is a new user
      if (data.data.user.isNewUser) {
        // Move to registration step
        setStep('register');
        return null;
      }
      
      // Return the user data for existing users
      return data.data.user;
    } catch (error: any) {
      console.error('Backend authentication failed:', error);
      throw error;
    }
  };

  // Update user profile with the new API endpoint
  const updateUserProfile = async (firebaseUser: FirebaseUser, profileData: { name: string; dob: string; email?: string }) => {
    try {
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
          name: profileData.name,
          dob: profileData.dob,
          email: profileData.email || undefined
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Profile update failed');
      }
      
      return data.user;
    } catch (error: any) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  // Handle registration form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firebaseUser) return;
    
    // Validate form
    if (!registrationData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!registrationData.dob) {
      setError('Please enter your date of birth');
      return;
    }
    
    try {
      setVerifyLoading(true);
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
          name: registrationData.name,
          dob: registrationData.dob,
          email: registrationData.email || undefined
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Profile update failed');
      }
      
      // Update auth context with the user data from your backend
      handleSuccessfulAuth(firebaseUser, data.user);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully",
        variant: "default"
      });
      
      // Close modal and call success callback
      if (onSuccess) onSuccess();
      onClose();
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      setError(error.message || 'Failed to complete registration. Please try again.');
    } finally {
      setVerifyLoading(false);
    }
  };
  
  // Handle resending OTP
  const handleResendOTP = async () => {
    if (!recaptchaContainerRef.current || sendOtpLoading) return;
    
    try {
      setSendOtpLoading(true);
      setError('');
      
      const appVerifier = setupRecaptcha('recaptcha-container');
      const result = await sendOTP(phone, appVerifier);
      
      if (result.success) {
        setConfirmationResult(result.confirmationResult);
        toast({
          title: "OTP Resent",
          description: "A new verification code has been sent to your phone",
          variant: "default"
        });
      } else if (result.error) {
        setError(result.error.message);
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      setError(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setSendOtpLoading(false);
    }
  };

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Handle animation on open/close
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when sheet is open
    } else {
      setTimeout(() => {
        setIsAnimating(false);
        document.body.style.overflow = ''; // Restore scrolling
      }, 300); // Match transition duration
    }
  }, [isOpen]);
  
  // Reset state when bottom sheet is closed
  const handleClose = () => {
    setStep('phone');
    setPhone('');
    setOtp('');
    setError('');
    setFirebaseUser(null);
    setRegistrationData({
      name: '',
      dob: '',
      email: ''
    });
    onClose();
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'bg-black/50' : 'bg-black/0 pointer-events-none'} transition-colors duration-300`} onClick={handleClose}>
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl max-h-[90vh] overflow-auto transform ${isOpen ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-300 ease-in-out`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bottom Sheet Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Bottom Sheet Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Sign In</h2>
          <button 
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          {step === 'phone' && (
            <div className="flex flex-col items-center mb-6">
              <div className="h-16 w-16 rounded-full bg-plum/10 flex items-center justify-center mb-3">
                <Scissors className="h-8 w-8 text-plum" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Stitch-It-Pretty-Fit</h3>
              <p className="text-sm text-gray-500 text-center">Sign in to access your custom tailoring experience</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg text-red-700 px-4 py-3 mb-6 text-sm flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-plum" />
                  </div>
                  <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-20 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum focus:border-plum text-lg"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    disabled={sendOtpLoading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">We'll send a verification code to this number</p>
              </div>
              
              {/* Invisible reCAPTCHA container */}
              <div id="recaptcha-container" ref={recaptchaContainerRef} className="hidden">
                {/* Invisible reCAPTCHA will be rendered here */}
              </div>
              
              <Button
                type="submit"
                className="w-full flex justify-center items-center py-6 px-4 rounded-lg text-white bg-plum hover:bg-plum/90 transition-colors shadow-md"
                disabled={sendOtpLoading}
              >
                {sendOtpLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                ) : (
                  <LogIn className="w-5 h-5 mr-2" />
                )}
                {sendOtpLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          ) : step === 'otp' ? (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center mb-2">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-plum/10 mb-3">
                  <Lock className="h-7 w-7 text-plum" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Verification Code</h3>
                <p className="text-sm text-gray-500 mt-1">Enter the 6-digit code sent to</p>
                <p className="text-md font-medium text-gray-800">+91 {phone}</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                  <button 
                    type="button" 
                    className="text-xs text-plum hover:text-plum/80 font-medium"
                    onClick={() => {
                      setStep('phone');
                      setOtp('');
                    }}
                  >
                    Change Number
                  </button>
                </div>
                
                {/* OTP Input with better styling */}
                <div className="flex justify-center">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum focus:border-plum text-center tracking-widest font-medium text-xl letter-spacing-2"
                    placeholder="• • • • • •"
                    maxLength={6}
                    disabled={verifyLoading}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full flex justify-center items-center py-6 px-4 rounded-lg text-white bg-plum hover:bg-plum/90 transition-colors shadow-md"
                disabled={verifyLoading}
              >
                {verifyLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                ) : (
                  <CheckCircle className="w-5 h-5 mr-2" />
                )}
                {verifyLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              
              <div className="text-center pt-2">
                <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
                <button 
                  type="button" 
                  className="text-sm text-plum hover:text-plum/80 font-medium inline-flex items-center"
                  onClick={handleResendOTP}
                  disabled={sendOtpLoading}
                >
                  {sendOtpLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-plum/30 border-t-plum rounded-full animate-spin mr-2"></div>
                      Resending...
                    </>
                  ) : (
                    "Resend OTP"
                  )}
                </button>
              </div>
            </form>
          ) : (
            // Registration form for new users
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-plum/10 mb-3">
                  <User className="h-7 w-7 text-plum" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Complete Your Profile</h3>
                <p className="text-sm text-gray-500 mt-1">Please provide the following details</p>
              </div>
              
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={registrationData.name}
                    onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum focus:border-plum"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
              
              {/* Date of Birth Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth <span className="text-red-500">*</span></label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={registrationData.dob}
                    onChange={(e) => setRegistrationData({...registrationData, dob: e.target.value})}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum focus:border-plum"
                    required
                  />
                </div>
              </div>
              
              {/* Email Input (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum focus:border-plum"
                    placeholder="Enter your email address"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">We'll use this for order updates and promotions</p>
              </div>
              
              <Button
                type="submit"
                className="w-full flex justify-center items-center py-6 px-4 rounded-lg text-white bg-plum hover:bg-plum/90 transition-colors shadow-md"
                disabled={verifyLoading}
              >
                {verifyLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                ) : (
                  <CheckCircle className="w-5 h-5 mr-2" />
                )}
                {verifyLoading ? "Creating Account..." : "Complete Registration"}
              </Button>
            </form>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBottomSheet;
