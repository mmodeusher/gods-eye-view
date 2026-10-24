/**
 * OSINT Cache Layer
 * 
 * Provides caching for OSINT lookup results to reduce redundant processing.
 * Uses in-memory cache with localStorage fallback for persistence across sessions.
 * Supports TTL (Time-To-Live) expiration for cached entries.
 * 
 * @module osintCache
 */

/**
 * Cache entry with metadata
 * @typedef {Object} CacheEntry
 * @property {any} data - The cached data
 * @property {number} timestamp - Unix timestamp when entry was created
 * @property {number} [ttl] - Time-to-live in milliseconds (undefined = no expiry)
 * @property {string[]} [tags] - Tags for selective invalidation
 */

/**
 * OSINT Cache class
 * 
 * Provides methods for storing and retrieving cached OSINT results.
 * Automatically handles TTL expiration and cache size management.
 */
export class OSINTCache {
  /**
   * Create a new OSINT cache
   * @param {Object} [options] - Cache configuration options
   * @param {number} [options.defaultTTL=3600000] - Default TTL in milliseconds (1 hour)
   * @param {number} [options.maxSize=1000] - Maximum number of cache entries
   * @param {boolean} [options.useStorage=true] - Whether to use localStorage for persistence
   */
  constructor(options = {}) {
    this.defaultTTL = options.defaultTTL || 3600000; // 1 hour
    this.maxSize = options.maxSize || 1000;
    this.useStorage = options.useStorage !== false;
    
    // In-memory cache
    this._cache = new Map();
    
    // Load from localStorage if available
    if (this.useStorage) {
      this._loadFromStorage();
    }
  }

  /**
   * Get a cached entry by key
   * @param {string} key - Cache key
   * @returns {any|null} Cached data or null if not found/expired
   */
  get(key) {
    const entry = this._cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (this._isExpired(entry)) {
      this.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set a cache entry
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {Object} [options] - Set options
   * @param {number} [options.ttl] - TTL in milliseconds (uses default if not specified)
   * @param {string[]} [options.tags] - Tags for selective invalidation
   */
  set(key, data, options = {}) {
    const entry = {
      data,
      timestamp: Date.now(),
      ttl: options.ttl || this.defaultTTL,
      tags: options.tags || []
    };

    // Evict oldest entries if cache is full
    if (this._cache.size >= this.maxSize) {
      this._evictOldest();
    }

    this._cache.set(key, entry);

    // Persist to localStorage if enabled
    if (this.useStorage) {
      this._saveToStorage();
    }
  }

  /**
   * Delete a cache entry
   * @param {string} key - Cache key to delete
   * @returns {boolean} True if entry was deleted
   */
  delete(key) {
    const deleted = this._cache.delete(key);
    
    if (this.useStorage) {
      this._saveToStorage();
    }
    
    return deleted;
  }

  /**
   * Check if a key exists and is not expired
   * @param {string} key - Cache key to check
   * @returns {boolean} True if key exists and is valid
   */
  has(key) {
    const entry = this._cache.get(key);
    return entry && !this._isExpired(entry);
  }

  /**
   * Get all cache keys (non-expired)
   * @returns {string[]} Array of valid cache keys
   */
  keys() {
    return Array.from(this._cache.keys()).filter(key => !this._isExpired(this._cache.get(key)));
  }

  /**
   * Get cache entry count
   * @returns {number} Number of entries in cache
   */
  size() {
    // Clean expired entries and return count
    this.clearExpired();
    return this._cache.size;
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this._cache.clear();
    
    if (this.useStorage) {
      this._saveToStorage();
    }
  }

  /**
   * Clear expired entries
   * @returns {number} Number of entries cleared
   */
  clearExpired() {
    let count = 0;
    const now = Date.now();
    
    for (const [key, entry] of this._cache.entries()) {
      if (entry.ttl && now - entry.timestamp > entry.ttl) {
        this._cache.delete(key);
        count++;
      }
    }

    if (count > 0 && this.useStorage) {
      this._saveToStorage();
    }
    
    return count;
  }

  /**
   * Clear entries matching specific tags
   * @param {string[]} tags - Tags to match
   */
  clearByTags(tags) {
    let count = 0;
    
    for (const [key, entry] of this._cache.entries()) {
      if (entry.tags && entry.tags.some(tag => tags.includes(tag))) {
        this._cache.delete(key);
        count++;
      }
    }

    if (count > 0 && this.useStorage) {
      this._saveToStorage();
    }
  }

  /**
   * Get cache statistics
   * @returns {{ size: number, maxSize: number, defaultTTL: number, entries: number }}
   */
  stats() {
    return {
      size: this._cache.size,
      maxSize: this.maxSize,
      defaultTTL: this.defaultTTL,
      entries: this.clearExpired()
    };
  }

  /**
   * Check if an entry has expired
   * @param {CacheEntry} entry - Cache entry to check
   * @returns {boolean} True if expired
   * @private
   */
  _isExpired(entry) {
    if (!entry.ttl) {
      return false; // No TTL = no expiry
    }
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Evict oldest cache entries until size is under max
   * @private
   */
  _evictOldest() {
    let sorted = Array.from(this._cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    while (this._cache.size >= this.maxSize && sorted.length > 0) {
      const [key] = sorted.shift();
      this._cache.delete(key);
    }
  }

  /**
   * Load cache from localStorage
   * @private
   */
  _loadFromStorage() {
    try {
      const data = localStorage.getItem('gev_osint_cache');
      if (data) {
        const entries = JSON.parse(data);
        entries.forEach(([key, entry]) => {
          if (!this._isExpired(entry)) {
            this._cache.set(key, entry);
          }
        });
      }
    } catch (e) {
      console.warn('[OSINTCache] Failed to load cache from localStorage:', e);
      this._cache.clear();
    }
  }

  /**
   * Save cache to localStorage
   * @private
   */
  _saveToStorage() {
    try {
      const data = Object.fromEntries(this._cache);
      localStorage.setItem('gev_osint_cache', JSON.stringify(data));
    } catch (e) {
      console.warn('[OSINTCache] Failed to save cache to localStorage:', e);
    }
  }
}

/**
 * Create a default OSINT cache instance
 * @returns {OSINTCache}
 */
export function createDefaultCache() {
  return new OSINTCache({
    defaultTTL: 3600000, // 1 hour
    maxSize: 1000,
    useStorage: true
  });
}

/**
 * Create a cache key for phone number lookups
 * @param {string} phoneNumber - Phone number
 * @returns {string} Cache key
 */
export function createPhoneCacheKey(phoneNumber) {
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  return `phone:${cleaned}`;
}

/**
 * Create a cache key for geolocation lookups
 * @param {string} areaCode - Area code
 * @returns {string} Cache key
 */
export function createGeolocationCacheKey(areaCode) {
  return `geo:ac:${areaCode}`;
}

/**
 * Create a cache key for identity correlation lookups
 * @param {string} type - Lookup type (e.g., "name", "address")
 * @param {string} value - Lookup value
 * @returns {string} Cache key
 */
export function createIdentityCacheKey(type, value) {
  return `identity:${type}:${value}`;
}

export default {
  OSINTCache,
  createDefaultCache,
  createPhoneCacheKey,
  createGeolocationCacheKey,
  createIdentityCacheKey
};
