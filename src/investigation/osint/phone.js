/**
 * Phone Number OSINT Module
 *
 * Provides phone number parsing, validation, geolocation, and correlation
 * for the OSINT investigation system. Uses local databases (NANP area codes,
 * timezone mappings) without requiring external APIs.
 *
 * @module osint/phone
 */

import { getAreaCodeInfo, findNearestCity, TOLL_FREE_CODES, PREMIUM_RATE_CODES } from './data/nanpAreaCodes.js';
import { getStateTimezones, getPrimaryStateTimezone, convertToStateTime } from './data/timezones.js';

/**
 * @typedef {'valid' | 'invalid' | 'toll-free' | 'premium' | 'voip' | 'pager' | 'tollfree'} PhoneValidationResult
 * @typedef {'mobile' | 'landline' | 'voip' | 'unknown'} CarrierType
 * @typedef {Object} PhoneLocationInfo
 * @property {string} city - City name
 * @property {string} state - State abbreviation
 * @property {number} [latitude] - Latitude coordinate
 * @property {number} [longitude] - Longitude coordinate
 * @property {string[]} [timezones] - IANA timezone names
 * @typedef {Object} PhoneParseResult
 * @property {boolean} isValid - Whether the number is valid
 * @property {string} original - Original input string
 * @property {string} e164 - E.164 formatted number (+15551234567)
 * @property {string} national - National format (555-123-4567)
 * @property {string} [international] - International format with country code
 * @property {string} [countryCode] - ISO country code (default: "US")
 * @property {string} [areaCode] - 3-digit area code
 * @property {string} [exchange] - 3-digit exchange (prefix)
 * @property {string} [lineNumber] - Last 4 digits
 * @property {PhoneValidationResult} type - Validated phone number type
 * @property {PhoneLocationInfo} [location] - Geolocation info (if available)
 * @property {CarrierType} [carrierType] - Estimated carrier type
 */

/**
 * Parse and validate a phone number string
 *
 * Handles multiple input formats:
 * - "+15551234567" (E.164)
 * - "15551234567" (1 + digits)
 * - "(555) 123-4567" (parenthesized area code)
 * - "555-123-4567" (dashes)
 * - "555.123.4567" (dots)
 * - "5551234567" (plain digits)
 * - "+1 555 123 4567" (spaces)
 *
 * @param {string} input - Raw phone number string
 * @returns {PhoneParseResult} Parsed and validated result
 */
export function parsePhoneNumber(input) {
  console.log('[parsePhoneNumber] Input:', input);
  
  if (!input || typeof input !== 'string') {
    console.warn('[parsePhoneNumber] Invalid input (null/undefined/not string)');
    return {
      isValid: false,
      original: input || '',
      e164: '',
      national: '',
      type: 'invalid'
    };
  }

  const original = input.trim();
  console.log('[parsePhoneNumber] Trimmed original:', original);
  
  // Extract only digits and leading +
  const cleaned = original.replace(/[^\d+]/g, '');
  console.log('[parsePhoneNumber] Cleaned (digits only):', cleaned);
  
  // Determine country code and strip it for NANP processing
  let countryCode = 'US';
  let nationalNumber = cleaned;
  
  if (cleaned.startsWith('+')) {
    const possibleCC = cleaned.substring(1, 4);
    console.log('[parsePhoneNumber] Starts with +, possibleCC:', possibleCC);
    
    if (possibleCC === '1') {
      // +1 is country code for US/Canada (NANP)
      countryCode = 'US';
      nationalNumber = cleaned.substring(2);
      console.log('[parsePhoneNumber] NANP number detected, nationalNumber:', nationalNumber);
    } else if (/\d{3}/.test(possibleCC)) {
      // Non-NANP number - return as international
      console.log('[parsePhoneNumber] International number detected');
      return {
        isValid: true,
        original,
        e164: cleaned,
        national: cleaned,
        countryCode: 'INTL',
        type: 'valid'
      };
    } else {
      console.warn('[parsePhoneNumber] Invalid country code format');
      return {
        isValid: false,
        original,
        e164: '',
        national: '',
        type: 'invalid'
      };
    }
  } else if (cleaned.startsWith('1') && cleaned.length >= 10) {
    // Starts with 1 but no + prefix - likely NANP without country code
    console.log('[parsePhoneNumber] Starts with 1, stripping country code');
    nationalNumber = cleaned.substring(1);
  }

  console.log('[parsePhoneNumber] Final nationalNumber:', nationalNumber, 'length:', nationalNumber.length);
  
  // Validate NANP number length (must be 10 digits for domestic, 7+ area code for partial)
  if (nationalNumber.length === 10) {
    const areaCode = nationalNumber.substring(0, 3);
    const exchange = nationalNumber.substring(3, 6);
    const lineNumber = nationalNumber.substring(6);
    
    console.log('[parsePhoneNumber] 10-digit number: areaCode=', areaCode, 'exchange=', exchange, 'line=', lineNumber);
    
    return buildParseResult({
      original,
      countryCode,
      areaCode,
      exchange,
      lineNumber,
      fullNumber: nationalNumber
    });
  } else if (nationalNumber.length === 7) {
    // No area code - local number
    console.warn('[parsePhoneNumber] Only 7 digits (no area code)');
    const exchange = nationalNumber.substring(0, 3);
    const lineNumber = nationalNumber.substring(3);
    
    return {
      isValid: false,
      original,
      e164: '',
      national: nationalNumber,
      type: 'invalid',
      note: 'No area code provided'
    };
  } else {
    console.warn('[parsePhoneNumber] Invalid length:', nationalNumber.length);
    return {
      isValid: false,
      original,
      e164: '',
      national: '',
      type: 'invalid'
    };
  }
}

/**
 * Build a parse result object from cleaned components
 * @param {Object} params - Parse parameters
 * @returns {PhoneParseResult}
 */
function buildParseResult({ original, countryCode, areaCode, exchange, lineNumber, fullNumber }) {
  // Check for toll-free numbers
  if (TOLL_FREE_CODES.includes(areaCode)) {
    return {
      isValid: true,
      original,
      e164: `+1${fullNumber}`,
      national: `(${areaCode}) ${exchange}-${lineNumber}`,
      international: `+1 ${areaCode} ${exchange} ${lineNumber}`,
      countryCode,
      areaCode,
      exchange,
      lineNumber,
      type: 'toll-free'
    };
  }

  // Check for premium rate numbers
  if (PREMIUM_RATE_CODES.includes(areaCode)) {
    return {
      isValid: true,
      original,
      e164: `+1${fullNumber}`,
      national: `(${areaCode}) ${exchange}-${lineNumber}`,
      international: `+1 ${areaCode} ${exchange} ${lineNumber}`,
      countryCode,
      areaCode,
      exchange,
      lineNumber,
      type: 'premium'
    };
  }

  // Validate area code
  const areaCodeInfo = getAreaCodeInfo(areaCode);
  
  if (!areaCodeInfo) {
    // Unknown area code - could be invalid or new allocation
    return {
      isValid: false,
      original,
      e164: `+1${fullNumber}`,
      national: `(${areaCode}) ${exchange}-${lineNumber}`,
      international: `+1 ${areaCode} ${exchange} ${lineNumber}`,
      countryCode,
      areaCode,
      exchange,
      lineNumber,
      type: 'invalid',
      note: 'Unknown area code'
    };
  }

  // Validate exchange code (NXX)
  // Exchange codes starting with 0 or 1 were invalid in old NANP rules
  // But modern numbering allows more flexibility
  const firstExchangeDigit = exchange[0];
  
  // Geolocate the number
  const location = buildLocationInfo(areaCodeInfo);
  
  // Estimate carrier type based on area code patterns
  const carrierType = estimateCarrierType(areaCode, exchange);

  return {
    isValid: true,
    original,
    e164: `+1${fullNumber}`,
    national: `(${areaCode}) ${exchange}-${lineNumber}`,
    international: `+1 ${areaCode} ${exchange} ${lineNumber}`,
    countryCode,
    areaCode,
    exchange,
    lineNumber,
    type: 'valid',
    location,
    carrierType
  };
}

/**
 * Build location info from area code data
 * @param {Object} areaCodeInfo - Area code info from database
 * @returns {PhoneLocationInfo}
 */
function buildLocationInfo(areaCodeInfo) {
  const timezones = getStateTimezones(areaCodeInfo.state);
  
  return {
    city: areaCodeInfo.city,
    state: areaCodeInfo.state,
    latitude: areaCodeInfo.latitude,
    longitude: areaCodeInfo.longitude,
    timezones: timezones.map(tz => tz.name)
  };
}

/**
 * Estimate carrier type based on area code and exchange patterns
 *
 * Note: This is a heuristic estimate only. Accurate carrier identification
 * requires querying carrier databases or APIs.
 *
 * @param {string} areaCode - 3-digit area code
 * @param {string} exchange - 3-digit exchange
 * @returns {CarrierType}
 */
function estimateCarrierType(areaCode, exchange) {
  // VOIP prefixes - these are commonly associated with VoIP services
  // Based on FCC numbering portability data
  const voipPrefixes = new Set([
    '528', '610', '676', '931'
  ]);
  
  if (voipPrefixes.has(exchange)) {
    return 'voip';
  }

  // Pager codes (926x range)
  if (areaCode === '926') {
    return 'pager';
  }

  // Heuristic: newer area codes with overlapping coverage are more likely mobile
  // This is a rough estimate only
  return 'mobile';
}

/**
 * Resolve full OSINT information for a phone number
 *
 * Performs:
 * 1. Parsing and validation
 * 2. Geolocation via area code lookup
 * 3. Timezone determination
 * 4. Carrier type estimation
 * 5. Correlation with case data (if caseId provided)
 *
 * @param {string} phoneNumber - Phone number string
 * @param {Object} [options] - Resolution options
 * @param {string} [options.caseId] - Optional case ID for correlation
 * @returns {PhoneOSINTResult}
 */
export function resolvePhoneOSINT(phoneNumber, options = {}) {
  console.log('[resolvePhoneOSINT] Called with phoneNumber:', phoneNumber, 'options:', options);
  
  const parsed = parsePhoneNumber(phoneNumber);
  console.log('[resolvePhoneOSINT] Parsed result:', parsed);
  
  const result = {
    phoneNumber: phoneNumber,
    parsed,
    geolocation: null,
    carrier: null,
    correlation: null,
    timestamp: new Date().toISOString()
  };

  if (!parsed.isValid) {
    console.warn('[resolvePhoneOSINT] Phone number invalid:', parsed.note || 'Unknown reason');
    result.error = parsed.note || 'Invalid phone number';
    return result;
  }

  // Geolocation (only for valid NANP numbers)
  if (parsed.areaCode && parsed.type === 'valid') {
    console.log('[resolvePhoneOSINT] Looking up area code:', parsed.areaCode);
    const areaCodeInfo = getAreaCodeInfo(parsed.areaCode);
    console.log('[resolvePhoneOSINT] Area code info:', areaCodeInfo);
    
    if (areaCodeInfo) {
      result.geolocation = {
        areaCode: parsed.areaCode,
        city: areaCodeInfo.city,
        state: areaCodeInfo.state,
        latitude: areaCodeInfo.latitude,
        longitude: areaCodeInfo.longitude,
        counties: areaCodeInfo.counties || [],
        timezones: getStateTimezones(areaCodeInfo.state).map(tz => ({
          name: tz.name,
          abbreviation: tz.abbreviation,
          utcOffset: tz.utcOffset
        })),
        primaryTimezone: getPrimaryStateTimezone(areaCodeInfo.state)
      };
      console.log('[resolvePhoneOSINT] Geolocation set:', result.geolocation);
    }

    // Find nearby cities within 100 miles
    if (areaCodeInfo) {
      const nearby = findNearestCity(
        areaCodeInfo.latitude,
        areaCodeInfo.longitude,
        100
      );
      if (nearby) {
        result.geolocation.nearestCity = nearby;
      }
    }
  }

  // Carrier estimation
  if (parsed.carrierType) {
    result.carrier = {
      type: parsed.carrierType,
      note: 'Estimated based on numbering patterns. Accurate carrier info requires API lookup.'
    };
  }

  // Toll-free / premium detection
  if (parsed.type === 'toll-free') {
    result.tollFree = true;
  } else if (parsed.type === 'premium') {
    result.premiumRate = true;
  }

  // Correlation with case data (if caseId provided)
  if (options.caseId) {
    result.correlation = {
      caseId: options.caseId,
      status: 'pending'
    };
  }

  console.log('[resolvePhoneOSINT] Final result:', result);
  return result;
}

/**
 * @typedef {Object} PhoneOSINTResult
 * @property {string} phoneNumber - Original phone number input
 * @property {PhoneParseResult} parsed - Parsed validation result
 * @property {GeolocationInfo|null} geolocation - Geolocation data
 * @property {CarrierInfo|null} carrier - Carrier estimation
 * @property {CorrelationInfo|null} correlation - Case correlation data
 * @property {string} timestamp - ISO timestamp of resolution
 * @property {string} [error] - Error message if invalid
 * @property {boolean} [tollFree] - If number is toll-free
 * @property {boolean} [premiumRate] - If number is premium rate
 */

/**
 * @typedef {Object} GeolocationInfo
 * @property {string} areaCode - 3-digit area code
 * @property {string} city - City name
 * @property {string} state - State abbreviation
 * @property {number} latitude - Latitude
 * @property {number} longitude - Longitude
 * @property {string[]} counties - List of counties served
 * @property {TimezoneInfo[]} timezones - Available timezones
 * @property {TimezoneInfo} primaryTimezone - Primary timezone
 * @property {{ city: string, state: string, distance: number }} [nearestCity] - Nearest city
 */

/**
 * @typedef {Object} TimezoneInfo
 * @property {string} name - IANA timezone name
 * @property {string} abbreviation - Abbreviation (e.g., "CST")
 * @property {number} utcOffset - Base UTC offset in hours
 */

/**
 * @typedef {Object} CarrierInfo
 * @property {CarrierType} type - Estimated carrier type
 * @property {string} note - Explanation of estimation method
 */

/**
 * @typedef {Object} CorrelationInfo
 * @property {string} caseId - Associated case ID
 * @property {'pending' | 'resolved' | 'failed'} status - Correlation status
 */

/**
 * Format a phone number for display in different formats
 * @param {string} phoneNumber - Phone number to format
 * @param {'e164' | 'national' | 'international' | 'raw'} format - Desired output format
 * @returns {string} Formatted phone number
 */
export function formatPhoneNumber(phoneNumber, format = 'national') {
  const parsed = parsePhoneNumber(phoneNumber);
  
  switch (format) {
    case 'e164':
      return parsed.e164 || phoneNumber;
    case 'national':
      return parsed.national || phoneNumber;
    case 'international':
      return parsed.international || phoneNumber;
    case 'raw':
      return phoneNumber.replace(/[^\d]/g, '');
    default:
      return parsed.national || phoneNumber;
  }
}

/**
 * Check if a phone number is toll-free
 * @param {string} phoneNumber - Phone number to check
 * @returns {boolean} True if toll-free
 */
export function isTollFree(phoneNumber) {
  const parsed = parsePhoneNumber(phoneNumber);
  return parsed.type === 'toll-free';
}

/**
 * Check if a phone number is premium rate
 * @param {string} phoneNumber - Phone number to check
 * @returns {boolean} True if premium rate
 */
export function isPremiumRate(phoneNumber) {
  const parsed = parsePhoneNumber(phoneNumber);
  return parsed.type === 'premium';
}

/**
 * Get the local time for a phone number's location
 * @param {string} phoneNumber - Phone number to get time for
 * @param {Date} [date=new Date()] - Date to convert (defaults to now)
 * @returns {{ localTime: Date, timezone: string, utcOffset: number } | null}
 */
export function getPhoneNumberLocalTime(phoneNumber, date = new Date()) {
  const parsed = parsePhoneNumber(phoneNumber);
  
  if (!parsed.areaCode || !parsed.isValid) {
    return null;
  }

  const areaCodeInfo = getAreaCodeInfo(parsed.areaCode);
  if (!areaCodeInfo) {
    return null;
  }

  const primaryTz = getPrimaryStateTimezone(areaCodeInfo.state);
  const localTime = convertToStateTime(date, areaCodeInfo.state);

  return {
    localTime,
    timezone: primaryTz.name,
    utcOffset: primaryTz.utcOffset,
    abbreviation: primaryTz.abbreviation
  };
}

/**
 * Find annotations that match a phone number in a case
 * @param {string} phoneNumber - Phone number to search for
 * @param {string} caseId - Case ID to search in
 * @returns {Promise<MatchResult[]>}
 */
export async function findPhoneMatchesInCase(phoneNumber, caseId) {
  // This would be implemented by integrating with the case management system
  // For now, returning empty array as placeholder
  return [];
}

/**
 * Get detailed carrier information for a phone number
 * @param {string} phoneNumber - Phone number to get carrier info for
 * @returns {Promise<CarrierInfo>}
 */
export async function getCarrierInfo(phoneNumber) {
  const parsed = parsePhoneNumber(phoneNumber);
  
  if (!parsed.isValid) {
    return {
      type: 'unknown',
      note: 'Invalid phone number'
    };
  }
  
  // This would integrate with external APIs in a real implementation
  // For now, returning heuristic-based result
  return {
    type: parsed.carrierType || 'unknown',
    note: 'Estimated based on numbering patterns. Accurate carrier info requires API lookup.'
  };
}

export default {
  parsePhoneNumber,
  resolvePhoneOSINT,
  formatPhoneNumber,
  isTollFree,
  isPremiumRate,
  getPhoneNumberLocalTime,
  findPhoneMatchesInCase,
  getCarrierInfo
};
