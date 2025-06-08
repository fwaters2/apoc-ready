// Simple cache implementation for API responses
type CacheEntry<T> = {
  data: T;
  timestamp: number;
  expiry: number; // Expiry time in milliseconds
};

class ApiCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  
  // Default cache expiry of 5 minutes
  private defaultExpiry = 5 * 60 * 1000;
  
  // Set a value in the cache
  set<T>(key: string, data: T, expiry: number = this.defaultExpiry): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    });
  }
  
  // Get a value from the cache
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    // Return null if not found or expired
    if (!entry || Date.now() > entry.timestamp + entry.expiry) {
      if (entry) {
        // Clean up expired entry
        this.cache.delete(key);
      }
      return null;
    }
    
    return entry.data as T;
  }
  
  // Check if a key exists and is not expired
  has(key: string): boolean {
    const entry = this.cache.get(key);
    return !!entry && Date.now() <= entry.timestamp + entry.expiry;
  }
  
  // Clear all cache entries
  clear(): void {
    this.cache.clear();
  }
  
  // Create a cache key from scenario, answers, and locale
  createEvaluationKey(scenarioId: string, answers: string[], locale: string): string {
    return `evaluation:${scenarioId}:${locale}:${answers.join('|')}`;
  }
}

// Export a singleton instance
export const apiCache = new ApiCache(); 