import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  PhoneAuthProvider,
  signOut
} from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDv0H3CH9v1Pd89r9tUYwbfGxZnm3bJyjY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tailor-app-71fe2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tailor-app-71fe2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tailor-app-71fe2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "18861177327",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:18861177327:web:0fab29d846af096697de1a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-32LDE9GN71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Set language (commented out for mock implementation)
// auth.languageCode = 'en';

// Firebase Phone Authentication implementation
export const setupRecaptcha = (containerId: string) => {
  if (!containerId) {
    throw new Error('Container ID is required for reCAPTCHA');
  }
  
  // Clear any existing reCAPTCHA widgets
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
  }
  
  // Create a new reCAPTCHA verifier
  const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    'size': 'invisible', // Use invisible for better UX
    'callback': () => {
      console.log('reCAPTCHA verified');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
    }
  });
  
  // Render the reCAPTCHA
  return recaptchaVerifier;
};

export const sendOTP = async (phoneNumber: string, appVerifier: any) => {
  try {
    console.log(`Sending OTP to +91${phoneNumber}`);
    
    // Format phone number with country code
    const formattedPhoneNumber = `+91${phoneNumber}`;
    
    // Use real Firebase Phone Authentication
    const confirmationResult = await signInWithPhoneNumber(
      auth, 
      formattedPhoneNumber, 
      appVerifier
    );
    
    return { success: true, confirmationResult };
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    let errorMessage = "Failed to send verification code";
    
    // Handle specific Firebase error codes
    if (error.code === 'auth/invalid-phone-number') {
      errorMessage = "Invalid phone number format";
    } else if (error.code === 'auth/quota-exceeded') {
      errorMessage = "Too many requests. Please try again later";
    } else if (error.code === 'auth/captcha-check-failed') {
      errorMessage = "reCAPTCHA verification failed. Please try again";
    } else if (error.code === 'auth/operation-not-allowed') {
      console.warn('Phone Authentication is not enabled in Firebase console');
      errorMessage = "Phone authentication is not enabled. Please contact support.";
    } else if (error.code === 'auth/invalid-app-credential') {
      console.warn('Invalid app credential. reCAPTCHA configuration issue.');
      errorMessage = "Authentication configuration error. Please contact support.";
    }
    
    return { success: false, error: new Error(errorMessage) };
  }
};

export const verifyOTP = async (confirmationResult: any, otp: string) => {
  try {
    // Verify the OTP
    const result = await confirmationResult.confirm(otp);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    let errorMessage = "Failed to verify code";
    
    // Handle specific Firebase error codes
    if (error.code === 'auth/invalid-verification-code') {
      errorMessage = "Invalid verification code. Please try again";
    } else if (error.code === 'auth/code-expired') {
      errorMessage = "Verification code has expired. Please request a new one";
    }
    
    return { success: false, error: new Error(errorMessage) };
  }
};

export const logoutUser = async () => {
  try {
    // Sign out the user from Firebase
    await signOut(auth);
    // Clear any local storage data
    localStorage.removeItem('currentUser');
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error };
  }
};

export { auth, storage };
