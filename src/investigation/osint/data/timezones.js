/**
 * Timezone Mapping Database
 * 
 * Maps US states/coordinates to their primary timezone(s).
 * Used for converting phone number geolocation to local time.
 */

/**
 * @typedef {Object} TimezoneInfo
 * @property {string} name - IANA timezone name (e.g., "America/Chicago")
 * @property {string} abbreviation - Common abbreviation (e.g., "CST", "CDT")
 * @property {number} utcOffset - Base UTC offset in hours
 */

/**
 * State to timezone mapping
 * Some states span multiple timezones
 * @type {Record<string, TimezoneInfo[]>}
 */
const STATE_TIMEZONES = {
  'AL': [{ name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 }],
  'AK': [{ name: 'America/Anchorage', abbreviation: 'AKST', utcOffset: -9 }],
  'AZ': [{ name: 'America/Phoenix', abbreviation: 'MST', utcOffset: -7 }],
  'CA': [{ name: 'America/Los_Angeles', abbreviation: 'PST', utcOffset: -8 }],
  'CO': [{ name: 'America/Denver', abbreviation: 'MST', utcOffset: -7 }],
  'CT': [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }],
  'FL': [
    { name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 },
    { name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 }
  ],
  'GA': [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }],
  'HI': [{ name: 'Pacific/Honolulu', abbreviation: 'HST', utcOffset: -10 }],
  'IA': [{ name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 }],
  'ID': [
    { name: 'America/Boise', abbreviation: 'MST', utcOffset: -7 },
    { name: 'America/Los_Angeles', abbreviation: 'PST', utcOffset: -8 }
  ],
  'IL': [{ name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 }],
  'IN': [
    { name: 'America/Indiana/Indianapolis', abbreviation: 'EST', utcOffset: -5 },
    { name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 }
  ],
  'KS': [{ name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 }],
  'KY': [
    { name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 },
    { name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 }
  ],
  'LA': [{ name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 }],
  'MA': [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }],
  'MD': [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }],
  'ME': [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }],
  'MI': [{ name: 'America/Detroit', abbreviation: 'EST', utcOffset: -5 }],
  'MN': [{ name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 }],
  'MO': [{ name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 }],
  'MS': [{ name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 }],
  'MT': [{ name: 'America/Denver', abbreviation: 'MST', utcOffset: -7 }],
  'NC': [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }],
  'ND': [
    { name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 },
    { name: 'America/Denver', abbreviation: 'MST', utcOffset: -7 }
  ],
  'NE': [
    { name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 },
    { name: 'America/Denver', abbreviation: 'MST', utcOffset: -7 }
  ],
  'NH': [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }],
  'NJ': [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }],
  'NM': [{ name: 'America/Denver', abbreviation: 'MST', utcOffset: -7 }],
  'NV': [
    { name: 'America/Los_Angeles', abbreviation: 'PST', utcOffset: -8 },
    { name: 'America/Denver', abbreviation: 'MST', utcOffset: -7 }
  ],
  'OH': [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }],
  'OK': [{ name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 }],
  'OR': [
    { name: 'America/Los_Angeles', abbreviation: 'PST', utcOffset: -8 },
    { name: 'America/Denver', abbreviation: 'MST', utcOffset: -7 }
  ],
  'PA': [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }],
  'RI': [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }],
  'SC': [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }],
  'SD': [
    { name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 },
    { name: 'America/Denver', abbreviation: 'MST', utcOffset: -7 }
  ],
  'TN': [{ name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 }],
  'TX': [
    { name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 },
    { name: 'America/Denver', abbreviation: 'MST', utcOffset: -7 }
  ],
  'UT': [{ name: 'America/Denver', abbreviation: 'MST', utcOffset: -7 }],
  'VT': [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }],
  'VA': [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }],
  'WA': [{ name: 'America/Los_Angeles', abbreviation: 'PST', utcOffset: -8 }],
  'WI': [{ name: 'America/Chicago', abbreviation: 'CST', utcOffset: -6 }],
  'WV': [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }],
  'WY': [{ name: 'America/Denver', abbreviation: 'MST', utcOffset: -7 }],
  'DC': [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }]
};

/**
 * Get timezone info for a state
 * @param {string} stateAbbrev - State abbreviation
 * @returns {TimezoneInfo[]} Array of timezone info objects
 */
export function getStateTimezones(stateAbbrev) {
  return STATE_TIMEZONES[stateAbbrev] || [{ name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 }];
}

/**
 * Get the primary (first) timezone for a state
 * @param {string} stateAbbrev - State abbreviation
 * @returns {TimezoneInfo} Primary timezone info
 */
export function getPrimaryStateTimezone(stateAbbrev) {
  const timezones = STATE_TIMEZONES[stateAbbrev];
  return timezones ? timezones[0] : { name: 'America/New_York', abbreviation: 'EST', utcOffset: -5 };
}

/**
 * Get timezone offset for a state at a given date
 * @param {string} stateAbbrev - State abbreviation
 * @param {Date} [date=new Date()] - Date to calculate offset for
 * @returns {number} UTC offset in hours (accounts for DST)
 */
export function getTimezoneOffset(stateAbbrev, date = new Date()) {
  const timezones = STATE_TIMEZONES[stateAbbrev];
  if (!timezones || timezones.length === 0) {
    return -5; // Default to EST
  }

  // For states with multiple timezones, return the first one
  const tz = timezones[0];
  
  // Check if DST is in effect for this timezone
  const isDST = checkDST(date, tz.name);
  
  return tz.utcOffset + (isDST ? 1 : 0);
}

/**
 * Check if DST is in effect for a given date and timezone
 * @param {Date} date - Date to check
 * @param {string} timezoneName - IANA timezone name
 * @returns {boolean} True if DST is in effect
 */
function checkDST(date, timezoneName) {
  // Arizona and Hawaii don't observe DST
  const noDSTTimezones = ['America/Phoenix', 'Pacific/Honolulu'];
  if (noDSTTimezones.includes(timezoneName)) {
    return false;
  }

  // DST runs from second Sunday in March to first Sunday in November
  const year = date.getUTCFullYear();
  
  // Calculate second Sunday in March
  const march1 = new Date(Date.UTC(year, 2, 1));
  const secondSundayMarch = new Date(Date.UTC(year, 2, 1 + (14 - march1.getUTCDay())));
  
  // Calculate first Sunday in November
  const nov1 = new Date(Date.UTC(year, 10, 1));
  const firstSundayNovember = new Date(Date.UTC(year, 10, 1 + (7 - nov1.getUTCDay())));
  
  // Check if date is within DST range
  return date >= secondSundayMarch && date < firstSundayNovember;
}

/**
 * Convert UTC time to local time for a state
 * @param {Date} utcDate - UTC date/time
 * @param {string} stateAbbrev - State abbreviation
 * @returns {Date} Local date/time
 */
export function convertToStateTime(utcDate, stateAbbrev) {
  const offset = getTimezoneOffset(stateAbbrev, utcDate);
  return new Date(utcDate.getTime() + offset * 60 * 60 * 1000);
}

/**
 * Get all unique timezones
 * @returns {TimezoneInfo[]} Array of all timezone info objects
 */
export function getAllTimezones() {
  const unique = new Map();
  Object.values(STATE_TIMEZONES).forEach((timezones) => {
    timezones.forEach((tz) => {
      unique.set(tz.name, tz);
    });
  });
  return Array.from(unique.values());
}

export { STATE_TIMEZONES };
