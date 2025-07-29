// Advanced caching utility for API responses and expensive operations
class Cache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
  }

  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now() + ttl);
    return value;
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    
    const timestamp = this.timestamps.get(key);
    if (Date.now() > timestamp) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }

  has(key) {
    if (!this.cache.has(key)) return false;
    
    const timestamp = this.timestamps.get(key);
    if (Date.now() > timestamp) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return false;
    }
    
    return true;
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, timestamp] of this.timestamps.entries()) {
      if (now > timestamp) {
        this.cache.delete(key);
        this.timestamps.delete(key);
      }
    }
  }
}

// Global cache instance
export const apiCache = new Cache();

// Cache decorator for async functions
export function cached(key, ttl) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args) {
      const cacheKey = `${key}_${JSON.stringify(args)}`;
      
      if (apiCache.has(cacheKey)) {
        return apiCache.get(cacheKey);
      }
      
      const result = await originalMethod.apply(this, args);
      return apiCache.set(cacheKey, result, ttl);
    };
    
    return descriptor;
  };
}

// Simple cache wrapper for functions
export function withCache(fn, cacheKey, ttl = 5 * 60 * 1000) {
  return async (...args) => {
    const key = `${cacheKey}_${JSON.stringify(args)}`;
    
    if (apiCache.has(key)) {
      return apiCache.get(key);
    }
    
    const result = await fn(...args);
    return apiCache.set(key, result, ttl);
  };
}

// Cleanup expired cache entries every 10 minutes
setInterval(() => {
  apiCache.cleanup();
}, 10 * 60 * 1000);
