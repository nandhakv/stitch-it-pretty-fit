/**
 * API Interceptor
 * 
 * This file sets up a proper API interceptor that will:
 * 1. Show when API calls are being made
 * 2. Log all requests and responses
 * 3. Provide visual feedback when APIs are called
 */

// Central registry for API calls
interface ApiCallRecord {
  url: string;
  method: string;
  timestamp: number;
  duration?: number;
  status?: number;
  response?: any;
  error?: Error;
}

// API Logger class
class ApiLogger {
  private static instance: ApiLogger;
  private calls: ApiCallRecord[] = [];
  private listeners: Array<(call: ApiCallRecord) => void> = [];

  private constructor() {}

  static getInstance(): ApiLogger {
    if (!ApiLogger.instance) {
      ApiLogger.instance = new ApiLogger();
    }
    return ApiLogger.instance;
  }

  logApiCall(call: ApiCallRecord): void {
    this.calls.push(call);
    this.notifyListeners(call);
    
    // Log to console in a noticeable way
    console.group(`🌐 API Call: ${call.method} ${call.url}`);
    console.log(`⏱️ Timestamp: ${new Date(call.timestamp).toISOString()}`);
    
    if (call.duration) {
      console.log(`⏱️ Duration: ${call.duration}ms`);
    }
    
    if (call.status) {
      console.log(`📊 Status: ${call.status}`);
    }
    
    if (call.response) {
      console.log(`✅ Response:`, call.response);
    }
    
    if (call.error) {
      console.error(`❌ Error:`, call.error);
    }
    
    console.groupEnd();
  }

  getCalls(): ApiCallRecord[] {
    return [...this.calls];
  }

  addListener(listener: (call: ApiCallRecord) => void): void {
    this.listeners.push(listener);
  }

  private notifyListeners(call: ApiCallRecord): void {
    this.listeners.forEach(listener => listener(call));
  }
}

// Create a custom fetch function that logs API calls
const originalFetch = window.fetch;
window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input.url;
  const method = init?.method || 'GET';
  
  // Create an API call record
  const callRecord: ApiCallRecord = {
    url,
    method,
    timestamp: Date.now()
  };
  
  // Show API call visually
  const notificationBar = document.createElement('div');
  notificationBar.style.position = 'fixed';
  notificationBar.style.top = '0';
  notificationBar.style.left = '0';
  notificationBar.style.width = '100%';
  notificationBar.style.backgroundColor = '#007bff';
  notificationBar.style.color = 'white';
  notificationBar.style.padding = '8px 16px';
  notificationBar.style.textAlign = 'center';
  notificationBar.style.zIndex = '10000';
  notificationBar.style.fontWeight = 'bold';
  notificationBar.innerText = `${method} ${url}`;
  document.body.appendChild(notificationBar);
  
  try {
    // Start timer
    const startTime = performance.now();
    
    // Make the actual API call
    const response = await originalFetch(input, init);
    
    // End timer
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    
    // Clone the response so we can read it multiple times
    const responseClone = response.clone();
    
    // Update the call record
    callRecord.duration = duration;
    callRecord.status = response.status;
    
    // Try to parse the response as JSON
    try {
      callRecord.response = await responseClone.json();
    } catch (e) {
      // Not JSON, that's okay
    }
    
    // Update the notification
    notificationBar.style.backgroundColor = response.ok ? '#28a745' : '#dc3545';
    notificationBar.innerText = `${method} ${url} - ${response.status} ${response.statusText} (${duration}ms)`;
    
    // Log the API call
    ApiLogger.getInstance().logApiCall(callRecord);
    
    // Remove the notification after a few seconds
    setTimeout(() => {
      if (document.body.contains(notificationBar)) {
        document.body.removeChild(notificationBar);
      }
    }, 3000);
    
    // Return the original response
    return response;
  } catch (error) {
    // Update the call record
    callRecord.error = error as Error;
    
    // Update the notification
    notificationBar.style.backgroundColor = '#dc3545';
    notificationBar.innerText = `${method} ${url} - Error: ${(error as Error).message}`;
    
    // Log the API call
    ApiLogger.getInstance().logApiCall(callRecord);
    
    // Remove the notification after a few seconds
    setTimeout(() => {
      if (document.body.contains(notificationBar)) {
        document.body.removeChild(notificationBar);
      }
    }, 3000);
    
    // Re-throw the error
    throw error;
  }
};

// Export the API logger
export const apiLogger = ApiLogger.getInstance();

// Initialize the interceptor when imported
console.log('🔄 API Interceptor initialized');
