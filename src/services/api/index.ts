// API client for Stitch-it-Pretty-Fit
// This file exports all API endpoints organized by category

// Note: API implementation moved to consolidated file at '../api.ts'
// This is just a passthrough file

export * from '../api';

// Base API configuration
const API_BASE_URL = 'https://api.stitchitprettyfit.com'; // Replace with actual API URL when available

// Common headers
export const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request function
export const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// No mock data should be used
export const USE_MOCK_API = false;
