/**
 * OSINT Service — Unified Facade
 *
 * Provides a single entry point for all OSINT operations.
 * Coordinates between the resolver, cache, and domain modules.
 * Integrates with case management and annotation persistence.
 *
 * @module osintService
 */

import { OSINTResolver } from './osintResolver.js';
import { createDefaultCache } from './osintCache.js';
import { resolvePhoneOSINT, parsePhoneNumber, formatPhoneNumber, getPhoneNumberLocalTime, findPhoneMatchesInCase, getCarrierInfo } from './osint/phone.js';

/**
 * OSINT Service class
 *
 * Main facade for OSINT operations. Provides:
 * - Phone number OSINT lookups
 * - Geolocation correlation
 * - Identity correlation with cases
 * - CCTV camera discovery (future)
 * - Cache management
 * - Enhanced phone correlation features
 */
export class OSINTService {
  /**
   * Create a new OSINT service
   * @param {Object} [options] - Service options
   * @param {OSINTResolver} [options.resolver] - Resolver instance (creates default if not provided)
   * @param {OSINTCache} [options.cache] - Cache instance (creates default if not provided)
   * @param {CaseManager} [options.caseManager] - Case manager for correlation
   * @param {AnnotationPersistence} [options.annotationPersistence] - Annotation persistence
   * @param {Object} [options.apiConfig] - Optional API configuration
   */
  constructor(options = {}) {
    this.resolver = options.resolver || new OSINTResolver({ cache: options.cache });
    this.cache = this.resolver.cache || createDefaultCache();
    this.caseManager = options.caseManager || null;
    this.annotationPersistence = options.annotationPersistence || null;
    this.apiConfig = options.apiConfig || {};
    
    // Lookup statistics
    this._stats = {
      totalLookups: 0,
      successfulLookups: 0,
      failedLookups: 0,
      cacheHits: 0
    };
  }

  /**
   * Perform a complete phone number OSINT lookup
   *
   * This is the primary method for phone number investigation.
   * It performs parsing, validation, geolocation, and optional
   * case correlation in a single call.
   *
   * @param {string} phoneNumber - Phone number to investigate
   * @param {Object} [options] - Lookup options
   * @param {string} [options.caseId] - Associate results with a case
   * @param {boolean} [options.saveToCase=true] - Save results to case annotations
   * @param {boolean} [options.forceRefresh=false] - Bypass cache and force fresh lookup
   * @returns {Promise<PhoneOSINTResult>}
   */
  async lookupPhoneNumber(phoneNumber, options = {}) {
    console.log('[OSINTService] lookupPhoneNumber called with:', phoneNumber, options);
    console.log('[OSINTService] this.resolver:', this.resolver);
    console.log('[OSINTService] this.annotationPersistence:', this.annotationPersistence);
    
    this._stats.totalLookups++;
    
    const result = await this.resolver.resolve({
      type: 'phone',
      value: phoneNumber,
      context: {
        caseId: options.caseId,
        forceRefresh: options.forceRefresh
      }
    });

    console.log('[OSINTService] resolver.resolve returned:', result);

    if (result.success) {
      this._stats.cacheHits++;
      this._stats.successfulLookups++;
      
      // Save to case if requested
      if (options.caseId && options.saveToCase !== false && this.annotationPersistence) {
        console.log('[OSINTService] Saving phone OSINT to case:', options.caseId);
        await this._savePhoneOSINTToCase(options.caseId, phoneNumber, result);
      }
    } else {
      this._stats.failedLookups++;
    }

    console.log('[OSINTService] lookupPhoneNumber returning:', result);
    return result;
  }

  /**
    * Save phone OSINT results to a case as annotation metadata
    * @param {string} caseId - Case ID
    * @param {string} phoneNumber - Phone number that was looked up
    * @param {Object} osintResult - OSINT lookup result
    * @returns {Promise<void>}
    * @private
    */
  async _savePhoneOSINTToCase(caseId, phoneNumber, osintResult) {
    try {
      const annotationId = `osint_phone_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      // Build OSINT metadata for storage
      const metadata = {
        type: 'phone_osint',
        phoneNumber: phoneNumber,
        parsed: osintResult.parsed,
        geolocation: osintResult.geolocation,
        carrier: osintResult.carrier,
        timestamp: osintResult.timestamp || new Date().toISOString()
      };

      // Build extension with OSINT annotation type
      const extension = {
        caseId,
        source: 'osint',
        metadata,
        isPersistent: true
      };

      // Persist the annotation
      await this.annotationPersistence.persist(annotationId, extension);
      
      // Add to case if case manager available
      if (this.caseManager) {
        const activeCaseId = this.caseManager.getActiveCaseId();
        if (activeCaseId === caseId) {
          // Case is active, no need to add annotation
        }
      }

    } catch (error) {
      console.error('[OSINTService] Failed to save phone OSINT to case:', error);
    }
  }

  /**
   * Correlate a phone number with existing case data
   *
   * Checks if the phone number's geolocation matches any addresses
   * or locations already in the case.
   *
   * @param {string} phoneNumber - Phone number to correlate
   * @param {string} caseId - Case ID to correlate against
   * @returns {Promise<CorrelationResult>}
   */
  async correlateWithCase(phoneNumber, caseId) {
    // Get phone OSINT data
    const phoneResult = await this.lookupPhoneNumber(phoneNumber, { caseId });
    
    if (!phoneResult.success || !phoneResult.geolocation) {
      return {
        success: false,
        phoneNumber,
        caseId,
        correlations: [],
        error: 'Phone lookup failed or no geolocation data'
      };
    }

    // Get case data for correlation
    const caseData = this.caseManager?.getCase(caseId);
    if (!caseData) {
      return {
        success: false,
        phoneNumber,
        caseId,
        correlations: [],
        error: 'Case not found'
      };
    }

    const correlations = [];

    // Correlate with case annotations that have location data
    if (caseData.annotations) {
      for (const annotationId of caseData.annotations) {
        const annotation = this.annotationPersistence?.get(annotationId);
        if (annotation?.metadata?.geolocation) {
          const annotationLocation = annotation.metadata.geolocation;
          
          // Check if states match
          if (annotationLocation.state === phoneResult.geolocation.state) {
            correlations.push({
              type: 'state_match',
              annotationId,
              confidence: 'medium',
              description: `Phone number's area code is in ${phoneResult.geolocation.state}, matching this annotation's location`
            });
          }

          // Check if cities match
          if (annotationLocation.city?.toLowerCase() === phoneResult.geolocation.city?.toLowerCase()) {
            correlations.push({
              type: 'city_match',
              annotationId,
              confidence: 'high',
              description: `Phone number is associated with ${phoneResult.geolocation.city}, matching this annotation`
            });
          }
        }
      }
    }

    return {
      success: true,
      phoneNumber,
      caseId,
      phoneLocation: phoneResult.geolocation,
      correlations,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Discover CCTV cameras near a phone number's location
   *
   * Future implementation: Query camera database for devices
   * within a specified radius of the geolocated coordinates.
   *
   * @param {string} phoneNumber - Phone number to find cameras near
   * @param {number} [radiusMiles=5] - Search radius in miles
   * @returns {Promise<CCTVCameraResult>}
   */
  async discoverCamerasNear(phoneNumber, radiusMiles = 5) {
    const phoneResult = await this.lookupPhoneNumber(phoneNumber);
    
    if (!phoneResult.success || !phoneResult.geolocation) {
      return {
        success: false,
        phoneNumber,
        cameras: [],
        error: 'Phone lookup failed or no geolocation data'
      };
    }

    // Future: Query camera database
    // For now, return empty result with location info
    return {
      success: true,
      phoneNumber,
      searchLocation: {
        city: phoneResult.geolocation.city,
        state: phoneResult.geolocation.state,
        latitude: phoneResult.geolocation.latitude,
        longitude: phoneResult.geolocation.longitude
      },
      searchRadiusMiles: radiusMiles,
      cameras: [],
      note: 'CCTV camera discovery module not yet implemented',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Format a phone number for display
   * @param {string} phoneNumber - Phone number to format
   * @param {'e164' | 'national' | 'international' | 'raw'} [format='national'] - Desired format
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phoneNumber, format = 'national') {
    return formatPhoneNumber(phoneNumber, format);
  }

  /**
   * Get the local time for a phone number's location
   * @param {string} phoneNumber - Phone number
   * @param {Date} [date=new Date()] - Reference date
   * @returns {{ localTime: Date, timezone: string, utcOffset: number, abbreviation: string } | null}
   */
  getPhoneNumberLocalTime(phoneNumber, date = new Date()) {
    return getPhoneNumberLocalTime(phoneNumber, date);
  }

  /**
   * Find annotations that match a phone number in a case
   * @param {string} phoneNumber - Phone number to search for
   * @param {string} caseId - Case ID to search in
   * @returns {Promise<MatchResult[]>}
   */
  async findPhoneMatchesInCase(phoneNumber, caseId) {
    return await findPhoneMatchesInCase(phoneNumber, caseId);
  }

  /**
   * Get detailed carrier information for a phone number
   * @param {string} phoneNumber - Phone number to get carrier info for
   * @returns {Promise<CarrierInfo>}
   */
  async getCarrierInfo(phoneNumber) {
    return await getCarrierInfo(phoneNumber);
  }

  /**
   * Get lookup statistics
   * @returns {Object} Lookup stats
   */
  getStats() {
    return {
      ...this._stats,
      cacheSize: this.cache.size(),
      cacheStats: this.cache.stats()
    };
  }

  /**
   * Clear all cached data
   */
  clearCache() {
    this.resolver.clearCache();
  }

  /**
   * Update API configuration
   * @param {Object} config - New API configuration
   */
  updateAPIConfig(config) {
    this.apiConfig = { ...this.apiConfig, ...config };
  }
}

/**
 * @typedef {Object} CorrelationResult
 * @property {boolean} success - Whether correlation succeeded
 * @property {string} phoneNumber - Phone number that was correlated
 * @property {string} caseId - Case ID
 * @property {GeolocationInfo} [phoneLocation] - Phone geolocation data
 * @property {Correlation[]} correlations - List of correlations found
 * @property {string} [error] - Error message if failed
 * @property {string} timestamp - ISO timestamp
 */

/**
 * @typedef {Object} Correlation
 * @property {'state_match' | 'city_match'} type - Correlation type
 * @property {string} annotationId - Related annotation ID
 * @property {'low' | 'medium' | 'high'} confidence - Confidence level
 * @property {string} description - Human-readable description
 */

/**
 * @typedef {Object} CCTVCameraResult
 * @property {boolean} success - Whether the lookup succeeded
 * @property {string} phoneNumber - Phone number searched
 * @property {GeolocationInfo} searchLocation - Location that was searched
 * @property {number} searchRadiusMiles - Search radius
 * @property {CCTVCamera[]} cameras - Found cameras
 * @property {string} [error] - Error message if failed
 * @property {string} timestamp - ISO timestamp
 */

/**
 * @typedef {Object} CCTVCamera
 * @property {string} id - Camera ID
 * @property {string} name - Camera name/description
 * @property {number} latitude - Camera latitude
 * @property {number} longitude - Camera longitude
 * @property {number} distanceMiles - Distance from search center
 * @property {'public' | 'private' | 'unknown'} accessType - Camera access type
 */

/**
 * Create a default OSINT service instance
 * @param {Object} [options] - Options to pass to constructor
 * @returns {OSINTService}
 */
export function createDefaultOSINTService(options = {}) {
  return new OSINTService(options);
}

export default {
  OSINTService,
  createDefaultOSINTService
};
