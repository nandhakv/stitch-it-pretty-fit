import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, LogIn, Phone, CheckCircle, AlertCircle, ChevronRight, Lock, Scissors } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { setupRecaptcha, sendOTP, verifyOTP } from '../utils/firebase';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, handleSuccessfulAuth } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  
  // Reference for recaptcha container
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(-1);
    }
  }, [isAuthenticated, navigate]);
  
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
        setOtpSent(true);
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
        // Update auth context with the new user
        handleSuccessfulAuth(result.user);
        toast({
          title: "Authentication Successful",
          description: "You have been successfully logged in",
          variant: "default"
        });
        // Redirect to home or previous page
        navigate(-1);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back button */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-20">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-center flex-1 pr-10">Sign In</h1>
        </div>
      </header>
      
      <div className="container mx-auto px-4 pt-28 pb-8 max-w-md">
        <div className="flex flex-col items-center mb-8 mt-6">
          <div className="h-20 w-20 rounded-full bg-plum/10 flex items-center justify-center mb-4">
            <Scissors className="h-10 w-10 text-plum" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Stitch-It-Pretty-Fit</h2>
          <p className="text-gray-600 text-center">Sign in to access your custom tailoring experience</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg text-red-700 px-4 py-3 mb-6 text-sm flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {step === 'phone' ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
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
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center mb-2">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-plum/10 mb-4">
                  <Lock className="h-8 w-8 text-plum" />
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
                      setOtpSent(false);
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
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">Don't have an account?</p>
          <Link to="/register" className="text-plum hover:text-plum/80 font-medium inline-flex items-center">
            Create an account
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>By continuing, you agree to our</p>
          <div className="mt-1">
            <Link to="/terms" className="text-plum hover:text-plum/80 font-medium">Terms of Service</Link>
            <span className="mx-2">•</span>
            <Link to="/privacy" className="text-plum hover:text-plum/80 font-medium">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
