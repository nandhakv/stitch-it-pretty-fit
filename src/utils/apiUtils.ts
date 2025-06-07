// API Cache to prevent repeated failed API calls
interface CacheEntry {
  data: any;
  timestamp: number;
  error?: boolean;
  errorMessage?: string;
}

// Global cache to store API responses and track failed requests
const apiCache: Record<string, CacheEntry> = {};

// Default cache expiration time in milliseconds (5 minutes)
const DEFAULT_CACHE_EXPIRY = 5 * 60 * 1000;

// Failed request retry delay (increased with each attempt)
const RETRY_DELAYS = [1000, 5000, 15000]; // 1s, 5s, 15s

/**
 * Make an API request with caching and error handling to prevent repeated calls to failed endpoints
 * @param url The API endpoint URL
 * @param options Fetch options
 * @param cacheExpiry Cache expiration time in ms
 * @param maxRetries Maximum retry attempts for failed requests
 * @returns Promise with the API response
 */
export const cachedFetch = async <T>(
  url: string,
  options: RequestInit = {},
  cacheExpiry: number = DEFAULT_CACHE_EXPIRY,
  maxRetries: number = 2
): Promise<T> => {
  const cacheKey = `${url}:${JSON.stringify(options)}`;
  const cachedResponse = apiCache[cacheKey];
  
  // If we have a cached response that isn't expired
  if (cachedResponse && Date.now() - cachedResponse.timestamp < cacheExpiry) {
    // If it's an error response, throw the error
    if (cachedResponse.error) {
      throw new Error(cachedResponse.errorMessage || 'Unknown error');
    }
    return cachedResponse.data as T;
  }
  
  // If this is a known failed endpoint that has already been retried
  if (cachedResponse?.error && maxRetries <= 0) {
    throw new Error(cachedResponse.errorMessage || 'API request failed');
  }
  
  // Attempt to fetch
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache successful response
    apiCache[cacheKey] = {
      data,
      timestamp: Date.now(),
      error: false
    };
    
    return data as T;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // If we have retries left, we'll try again after a delay
    if (maxRetries > 0) {
      // Store a temporary error
      apiCache[cacheKey] = {
        data: null,
        timestamp: Date.now(),
        error: true,
        errorMessage
      };
      
      // Retry after delay
      const delayMs = RETRY_DELAYS[Math.min(RETRY_DELAYS.length - 1, 2 - maxRetries)];
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          cachedFetch<T>(url, options, cacheExpiry, maxRetries - 1)
            .then(resolve)
            .catch(reject);
        }, delayMs);
      });
    }
    
    // Store the error in cache to prevent repeated failed calls
    apiCache[cacheKey] = {
      data: null,
      timestamp: Date.now(),
      error: true,
      errorMessage
    };
    
    throw error;
  }
};

/**
 * Clear the API cache for a specific endpoint or all endpoints
 * @param url Optional URL to clear cache for specific endpoint
 */
export const clearApiCache = (url?: string) => {
  if (url) {
    // Clear cache for specific endpoint
    Object.keys(apiCache).forEach(key => {
      if (key.startsWith(`${url}:`)) {
        delete apiCache[key];
      }
    });
  } else {
    // Clear all cache
    Object.keys(apiCache).forEach(key => {
      delete apiCache[key];
    });
  }
};

/**
 * Track failed endpoints to avoid repeated calls
 */
export const markEndpointAsFailed = (url: string, errorMessage: string = 'Failed endpoint') => {
  // Mark all cache entries for this URL as failed
  Object.keys(apiCache).forEach(key => {
    if (key.startsWith(`${url}:`)) {
      apiCache[key] = {
        data: null,
        timestamp: Date.now(),
        error: true,
        errorMessage
      };
    }
  });
};

/**
 * Utility to build a unique cache key for an API request
 */
export const buildCacheKey = (url: string, params: Record<string, any> = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, String(value));
  });
  const queryString = queryParams.toString();
  return `${url}${queryString ? `?${queryString}` : ''}`;
};
