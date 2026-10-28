/**
 * OSINT Resolver — Router/Dispatcher
 * 
 * Routes OSINT lookup requests to the appropriate domain module
 * (phone, geospatial, identity, CCTV) based on lookup type.
 * Manages cache integration and fallback chains for each lookup type.
 * 
 * @module osintResolver
 */

import { resolvePhoneOSINT, parsePhoneNumber } from './osint/phone.js';
import { createDefaultCache, createPhoneCacheKey } from './osintCache.js';

/**
 * OSINT Resolver class
 * 
 * Central dispatcher for all OSINT lookups. Manages:
 * - Routing to appropriate domain modules
 * - Cache integration (hit/miss/set)
 * - Fallback chains when primary lookup fails
 * - Result normalization across modules
 */
export class OSINTResolver {
  /**
   * Create a new OSINT resolver
   * @param {Object} [options] - Resolver options
   * @param {OSINTCache} [options.cache] - Cache instance (creates default if not provided)
   * @param {boolean} [options.enableCache=true] - Whether to enable caching
   * @param {Object} [options.apiConfig] - Optional API configuration for external lookups
   */
  constructor(options = {}) {
    this.cache = options.cache || createDefaultCache();
    this.enableCache = options.enableCache !== false;
    this.apiConfig = options.apiConfig || {};
    
    // Lookup handlers map
    this._handlers = new Map();
    this._registerHandlers();
  }

  /**
   * Register default lookup handlers
   * @private
   */
  _registerHandlers() {
    this._handlers.set('phone', this._resolvePhone.bind(this));
    this._handlers.set('phone-correlation', this._resolvePhoneCorrelation.bind(this));
    this._handlers.set('geolocation', this._resolveGeolocation.bind(this));
    this._handlers.set('identity', this._resolveIdentity.bind(this));
    this._handlers.set('cctv', this._resolveCCTV.bind(this));
  }

  /**
   * Resolve an OSINT lookup
   * 
   * Routes to the appropriate handler based on lookup type.
   * Checks cache first, falls back to live resolution if cache miss.
   * 
   * @param {Object} params - Lookup parameters
   * @param {'phone' | 'geolocation' | 'identity' | 'cctv'} params.type - Lookup type
   * @param {string} params.value - Primary lookup value (e.g., phone number)
   * @param {Object} [params.context] - Additional context (e.g., caseId, location)
   * @returns {Promise<OSINTLookupResult>}
   */
  async resolve(params) {
    console.log('[OSINTResolver] resolve called with:', params);
    
    if (!params || !params.type || !params.value) {
      console.warn('[OSINTResolver] Missing required parameters:', params);
      return {
        success: false,
        type: params?.type || 'unknown',
        error: 'Missing required parameters: type, value'
      };
    }

    const handler = this._handlers.get(params.type);
    console.log('[OSINTResolver] Handler for type "' + params.type + '":', handler);
    
    if (!handler) {
      console.error('[OSINTResolver] No handler registered for type:', params.type);
      console.error('[OSINTResolver] Available handlers:', Array.from(this._handlers.keys()));
      return {
        success: false,
        type: params.type,
        error: `No handler registered for lookup type: ${params.type}`
      };
    }

    // Build cache key
    const cacheKey = this._buildCacheKey(params);
    console.log('[OSINTResolver] Cache key:', cacheKey);
    
    // Check cache first
    if (this.enableCache) {
      const cached = this.cache.get(cacheKey);
      console.log('[OSINTResolver] Cache lookup result:', cached);
      if (cached) {
        return {
          success: true,
          type: params.type,
          source: 'cache',
          ...cached
        };
      }
    }

    // Resolve via handler
    try {
      console.log('[OSINTResolver] Calling handler for type:', params.type);
      const result = await handler(params);
      console.log('[OSINTResolver] Handler returned:', result);
      
      // Cache successful results
      if (result.success && this.enableCache) {
        console.log('[OSINTResolver] Caching result for key:', cacheKey);
        this.cache.set(cacheKey, result, {
          tags: [params.type, params.value]
        });
      }

      return result;
    } catch (error) {
      console.error(`[OSINTResolver] Lookup failed for type ${params.type}:`, error);
      return {
        success: false,
        type: params.type,
        error: error.message || 'Lookup failed'
      };
    }
  }

  /**
   * Resolve phone number OSINT data
   * @param {Object} params - Lookup parameters
   * @returns {Promise<OSINTLookupResult>}
   * @private
   */
  _resolvePhone(params) {
    const phoneNumber = params.value;
    const context = params.context || {};
    
    // Parse and validate first
    const parsed = parsePhoneNumber(phoneNumber);
    
    if (!parsed.isValid) {
      return {
        success: false,
        type: 'phone',
        parsed,
        error: `Invalid phone number: ${parsed.note || 'Unknown format'}`
      };
    }

    // Resolve full OSINT data
    const osintData = resolvePhoneOSINT(phoneNumber, {
      caseId: context.caseId
    });

    return {
      success: true,
      type: 'phone',
      parsed,
      geolocation: osintData.geolocation,
      carrier: osintData.carrier,
      tollFree: osintData.tollFree || false,
      premiumRate: osintData.premiumRate || false,
      timestamp: osintData.timestamp
    };
  }

  /**
   * Resolve enhanced phone correlation with case data
   * @param {Object} params - Lookup parameters
   * @returns {Promise<OSINTLookupResult>}
   * @private
   */
  _resolvePhoneCorrelation(params) {
    const phoneNumber = params.value;
    const context = params.context || {};
    
    // This would be a more complex resolution that includes case correlation
    return this._resolvePhone(params);
  }

  /**
   * Resolve geolocation data from coordinates or address
   * @param {Object} params - Lookup parameters
   * @returns {Promise<OSINTLookupResult>}
   * @private
   */
  _resolveGeolocation(params) {
    // For now, delegate to phone area code lookup
    // Future: add address geocoding, reverse geocoding
    
    // If value is an area code, look it up directly
    if (/^\d{3}$/.test(params.value)) {
      const osintData = resolvePhoneOSINT(`+1${params.value}000000`);
      
      if (osintData.geolocation) {
        return {
          success: true,
          type: 'geolocation',
          areaCode: params.value,
          geolocation: osintData.geolocation,
          timestamp: new Date().toISOString()
        };
      }
    }

    return {
      success: false,
      type: 'geolocation',
      error: 'Unsupported geolocation input. Use 3-digit area code.'
    };
  }

  /**
   * Resolve identity correlation data
   * @param {Object} params - Lookup parameters
   * @returns {Promise<OSINTLookupResult>}
   * @private
   */
  _resolveIdentity(params) {
    // Identity correlation is done via case annotations
    // This handler prepares the correlation structure
    return {
      success: true,
      type: 'identity',
      status: 'pending',
      note: 'Identity correlation requires case context. Use osintService.correlateWithCase() instead.',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Resolve CCTV camera data near a location
   * @param {Object} params - Lookup parameters
   * @returns {Promise<OSINTLookupResult>}
   * @private
   */
  _resolveCCTV(params) {
    // CCTV camera discovery is done via geospatial module
    // This handler prepares the query structure
    return {
      success: true,
      type: 'cctv',
      status: 'pending',
      note: 'CCTV discovery requires geospatial context. Use osintService.discoverCameras() instead.',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Build a cache key for a lookup
   * @param {Object} params - Lookup parameters
   * @returns {string} Cache key
   * @private
   */
  _buildCacheKey(params) {
    const context = params.context || {};
    const contextStr = context.caseId ? `:${context.caseId}` : '';
    return `${params.type}:${params.value}${contextStr}`;
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getCacheStats() {
    return this.cache.stats();
  }

  /**
   * Register a custom lookup handler
   * @param {string} type - Lookup type
   * @param {Function} handler - Handler function (params) => Promise<OSINTLookupResult>
   */
  registerHandler(type, handler) {
    this._handlers.set(type, handler);
  }

  /**
   * Remove a lookup handler
   * @param {string} type - Lookup type to remove
   */
  unregisterHandler(type) {
    this._handlers.delete(type);
  }
}

/**
 * @typedef {Object} OSINTLookupResult
 * @property {boolean} success - Whether the lookup succeeded
 * @property {string} type - Lookup type
 * @property {string} [source] - Result source ('cache' | 'live' | 'partial')
 * @property {string} [error] - Error message if failed
 * @property {PhoneParseResult} [parsed] - Phone parsing result
 * @property {GeolocationInfo} [geolocation] - Geolocation data
 * @property {CarrierInfo} [carrier] - Carrier info
 * @property {boolean} [tollFree] - If number is toll-free
 * @property {boolean} [premiumRate] - If number is premium rate
 * @property {string} [timestamp] - ISO timestamp of result
 */

/**
 * Create a default OSINT resolver instance
 * @param {Object} [options] - Options to pass to constructor
 * @returns {OSINTResolver}
 */
export function createDefaultResolver(options = {}) {
  return new OSINTResolver(options);
}

export default {
  OSINTResolver,
  createDefaultResolver
};
