export const DEV_CONFIG = {
  // Enable/disable development mode
  DEV_MODE: process.env.NODE_ENV !== "production",
  
  // When true, use mock API responses instead of real API calls
  USE_MOCK_RESPONSES: process.env.NODE_ENV !== "production",
  
  // When true, cache API responses to avoid repeated calls
  CACHE_API_RESPONSES: true,
  
  // Simulated response delay in milliseconds (0 for immediate)
  MOCK_RESPONSE_DELAY: 500,
}; 