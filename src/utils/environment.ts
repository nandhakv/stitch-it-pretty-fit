/**
 * Environment utility to detect and provide environment-specific configurations
 */

export type Environment = 'local' | 'qa' | 'production';

/**
 * Get the current environment the app is running in
 */
export const getEnvironment = (): Environment => {
  return (import.meta.env.VITE_APP_ENV as Environment) || 'local';
};

/**
 * Check if the app is running in local development mode
 */
export const isLocal = (): boolean => {
  return getEnvironment() === 'local';
};

/**
 * Check if the app is running in QA mode
 */
export const isQA = (): boolean => {
  return getEnvironment() === 'qa';
};

/**
 * Check if the app is running in production mode
 */
export const isProduction = (): boolean => {
  return getEnvironment() === 'production';
};

/**
 * Get the API base URL for the current environment
 */
export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL as string;
};

/**
 * Check if feature flags are enabled in the current environment
 */
export const areFeatureFlagsEnabled = (): boolean => {
  return import.meta.env.VITE_FEATURE_FLAGS_ENABLED === 'true';
};

/**
 * Check if mock API is enabled in the current environment
 */
export const isMockApiEnabled = (): boolean => {
  return import.meta.env.VITE_ENABLE_MOCK_API === 'true';
};

/**
 * Get environment-specific configuration
 */
export const getEnvironmentConfig = () => {
  const env = getEnvironment();
  
  return {
    environment: env,
    apiBaseUrl: getApiBaseUrl(),
    featureFlagsEnabled: areFeatureFlagsEnabled(),
    mockApiEnabled: isMockApiEnabled(),
    isProduction: env === 'production',
    isLocal: env === 'local',
    isQA: env === 'qa',
  };
};

export default {
  getEnvironment,
  isLocal,
  isQA,
  isProduction,
  getApiBaseUrl,
  areFeatureFlagsEnabled,
  isMockApiEnabled,
  getEnvironmentConfig,
};
