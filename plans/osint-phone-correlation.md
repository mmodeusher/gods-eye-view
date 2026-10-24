# OSINT Phone Correlation — Focused Plan

## 1. Executive Summary

This plan focuses the OSINT suite on **phone number intelligence** as the primary use case. When a user enters a phone number into an investigation case, the system will:

1. **Parse & validate** the number (format normalization, country detection)
2. **Geolocate** via area code / prefix lookup (returns city, state, timezone)
3. **Identify carrier** information (mobile vs landline, provider)
4. **Correlate** with existing case data (annotations, locations, CCTV cameras near the number's location)
5. **Store results** as annotation metadata for AI case log generation

## 2. Phone OSINT Workflow

```
User enters phone number in CASES panel
    ↓
Phone parser normalizes: "+1 (555) 123-4567" → "15551234567"
    ↓
OSINT service routes to osintPhone module
    ↓
osintPhone runs correlation pipeline:
    ├── Step 1: Format validation & country detection
    ├── Step 2: Area code geolocation (NANP → city/state/timezone)
    ├── Step 3: Prefix (exchange) analysis for finer location
    ├── Step 4: Carrier type detection (mobile/landline/virtual)
    └── Step 5: Cross-reference with case data
         ├── Find annotations near the geolocated area
         ├── Find nearby CCTV cameras
         └── Check if number appears in existing annotations
    ↓
Results stored as OSINT metadata on annotation
    ↓
DETAILS panel displays correlation results
```

## 3. Architecture Overview

### Directory Structure

```
src/investigation/
├── osintService.js          # Unified OSINT facade (NEW)
├── osintResolver.js         # Multi-source resolver with fallback chains (NEW)
├── osintCache.js            # In-memory + localStorage cache (NEW)
└── osint/                   # Domain-specific modules (NEW)
    ├── phone.js             # Phone number OSINT core (NEW)
    └── geospatial.js        # Reverse geocode, Overpass, place lookup (NEW)
```

### Component Diagram

```mermaid
graph TB
    subgraph UI["UI Layer"]
        CP[CASES Panel<br/>caseManagementPanel.js]
        AMP[Annotation Metadata Panel<br/>annotationMetadataPanel.js]
    end

    subgraph OSINT["OSINT Service Layer (NEW)"]
        SVC[osintService.js — Facade]
        RES[osintResolver.js — Router]
        CACH[osintCache.js — Cache]
        subgraph DOMAINS["Domain Modules"]
            PHONE[phone.js — Phone OSINT]
            GEO[geospatial.js — Geospatial]
        end
    end

    subgraph EXISTING["Existing Infrastructure"]
        CM[CaseManager<br/>caseManager.js]
        AP[AnnotationPersistence<br/>annotationPersistence.js]
    end

    subgraph DATA_SOURCES["Data Sources"]
        NANP[NANP Area Code DB<br/>(local)]
        PREFIX[Prefix Geolocation<br/>(local + API)]
        TZ[Timezone DB<br/>(local)]
        GEOJSON[Local GeoJSON<br/>neighborhoods, regions]
        CCTV_DB[CCTV Catalog]
    end

    CP -->|phone lookup| SVC
    AMP -->|display results| CACH
    SVC --> RES
    RES --> PHONE
    RES --> GEO
    PHONE --> NANP
    PHONE --> PREFIX
    PHONE --> TZ
    GEO --> GEOJSON
    GEO --> CCTV_DB

    SVC -->|store result| CACH
    CACH -->|persist| AP
    AP --> CM
```

## 4. Phone Number OSINT Module Specification

### 4.1 `osint/phone.js` — Phone Correlation Engine

**Responsibility**: Parse, validate, geolocate, and correlate phone numbers.

**API**:
```javascript
export class OsintPhone {
  // Parse and normalize a phone number
  parse(phoneString) → ParsedPhone | null
  
  // Validate format and detect country
  validate(parsed) → ValidationResult
  
  // Get carrier type (mobile/landline/virtual/toll-free)
  getCarrierType(parsed) → CarrierType
  
  // Geolocate by area code / prefix
  geolocate(parsed) → LocationInfo | null
  
  // Full correlation pipeline
  correlate(phoneString, caseId) → PhoneCorrelationResult
  
  // Check if number matches any existing annotations in a case
  matchCaseAnnotations(phoneString, caseId) → MatchResult[]
}

// Return types:

/** @typedef {Object} ParsedPhone */
/** @property {string} e164 — E.164 normalized form (+15551234567) */
/** @property {string} country — ISO country code (US, CA, etc.) */
/** @property {string} national — National format ((555) 123-4567) */
/** @property {string} countryCode — Country code (1 for NANP) */
/** @property {string} areaCode — Area code (555) */
/** @property {string} exchange — Exchange/prefix (123) */
/** @property {string} subscriber — Subscriber number (4567) */
/** @property {boolean} isValid */

/** @typedef {Object} ValidationResult */
/** @property {boolean} valid */
/** @property {string[]} errors — List of validation errors */
/** @property {string[]} warnings — List of warnings */

/** @typedef {'mobile' | 'landline' | 'toll-free' | 'premium' | 'virtual' | 'voip' | 'unknown'} CarrierType */

/** @typedef {Object} LocationInfo */
/** @property {string} city — Primary city */
/** @property {string[]} alternateCities — Alternate cities for the area code */
/** @property {string} state — State/region code (TX, CA, etc.) */
/** @property {string} timezone — IANA timezone (America/Chicago) */
/** @property {number[]} coordinates — [lat, lon] of city center */
/** @property {string} areaCode — The matched area code */
/** @property {string} region — Broader region description */

/** @typedef {Object} PhoneCorrelationResult */
/** @property {ParsedPhone} parsed */
/** @property {ValidationResult} validation */
/** @property {CarrierType} carrierType */
/** @property {LocationInfo} location */
/** @property {MatchResult[]} annotationMatches — Matching annotations in the case */
/** @property {CameraMatch[]} nearbyCameras — Nearby CCTV cameras (if geolocation succeeded) */
/** @property {number} timestamp */

/** @typedef {Object} MatchResult */
/** @property {string} annotationId — ID of matching annotation */
/** @property {string} label — Annotation label */
/** @property {string} matchField — Which field matched (phone, metadata.phone, etc.) */
/** @property {string} matchedValue — The value that matched */

/** @typedef {Object} CameraMatch */
/** @property {string} cameraId — Camera ID */
/** @property {string} name — Camera name */
/** @property {number} distanceMeters — Distance from geolocated center */
```

### 4.2 Phone Number Data (Local)

Since we can't rely on paid APIs (Twilio Lookup, NumVerify), the phone OSINT module will use **local data sources** for correlation:

#### NANP Area Code Database (`src/investigation/osint/data/nanpAreaCodes.js`)

```javascript
// Local database of NANP area codes with geolocation data
export const AREA_CODE_DB = {
  '212': { city: 'New York', state: 'NY', timezone: 'America/New_York', coordinates: [40.7128, -74.0060], alternateCities: ['Brooklyn', 'Queens'] },
  '310': { city: 'Los Angeles', state: 'CA', timezone: 'America/Los_Angeles', coordinates: [34.0522, -118.2437], alternateCities: ['Santa Monica', 'Beverly Hills'] },
  '512': { city: 'Austin', state: 'TX', timezone: 'America/Chicago', coordinates: [30.2672, -97.7431], alternateCities: ['Round Rock'] },
  // ... more area codes
};

// Exchange (prefix) to city mapping for finer granularity
export const EXCHANGE_DB = {
  '212555': { city: 'New York', state: 'NY', coordinates: [40.7580, -73.9855] },
  // ... more exchanges
};

// Toll-free number ranges
export const TOLL_FREE_RANGES = ['800', '833', '844', '855', '866', '877', '888'];

// Premium rate ranges
export const PREMIUM_RANGES = ['900', '911']; // 911 is special
```

#### Timezone Database (`src/investigation/osint/data/timezones.js`)

```javascript
// IANA timezone to UTC offset mapping
export const TIMEZONE_OFFSETS = {
  'America/New_York': { utcOffset: '-05:00', dstOffset: '-04:00' },
  'America/Chicago': { utcOffset: '-06:00', dstOffset: '-05:00' },
  'America/Denver': { utcOffset: '-07:00', dstOffset: '-06:00' },
  'America/Los_Angeles': { utcOffset: '-08:00', dstOffset: '-07:00' },
  // ... more timezones
};

// Area code to timezone mapping (overrides for accuracy)
export const AREA_CODE_TIMEZONE = {
  '907': 'America/Anchorage',   // Alaska
  '808': 'Pacific/Honolulu',    // Hawaii
  // ... more overrides
};
```

### 4.3 Carrier Type Detection (Heuristic)

Since we can't use paid carrier lookup APIs, carrier type detection uses **heuristic rules** based on NANP numbering plan:

```javascript
// Toll-free prefixes
const TOLL_FREE = ['800', '833', '844', '855', '866', '877', '888'];

// Premium rate prefixes
const PREMIUM_RATE = ['900'];

// VoIP indicator patterns (based on FCC filings)
const VOIP_AREAS = new Set([
  // Known VoIP-exempt areas and patterns
]);

// Mobile vs landline heuristics (based on exchange assignment)
function detectCarrierType(areaCode, exchange) {
  if (TOLL_FREE.includes(exchange)) return 'toll-free';
  if (PREMIUM_RATE.includes(exchange)) return 'premium';
  
  // Exchange-based mobile/landline detection
  // This is heuristic and not 100% accurate without carrier lookup API
  // In production, integrate with Twilio Lookup or NumVerify for accuracy
  return 'unknown'; // Can't determine without paid API
}
```

**Note**: For **accurate carrier type detection**, the module will support optional integration with:
- **Twilio Lookup API** (paid, most accurate)
- **NumVerify API** (paid, alternative)
- **FreeGeoIP-style heuristics** (no API key needed, less accurate)

## 5. Implementation Phases

### Phase 1: Core Service + Phone Module (Primary Focus)

**Files created**:
| File | Purpose |
|------|---------|
| `src/investigation/osintService.js` | Unified OSINT facade |
| `src/investigation/osintResolver.js` | Multi-source resolver with fallback chains |
| `src/investigation/osintCache.js` | In-memory + localStorage cache with TTL |
| `src/investigation/osint/phone.js` | Phone number parsing, validation, geolocation, correlation |
| `src/investigation/osint/data/nanpAreaCodes.js` | NANP area code → city/state/timezone database |
| `src/investigation/osint/data/timezones.js` | Timezone mapping database |

**Files modified**:
| File | Change |
|------|--------|
| `src/ui/caseManagementPanel.js` | Add phone input field + "Correlate" button |
| `src/ui/annotationMetadataPanel.js` | Add phone OSINT results section |

**Deliverables**:
- Phone number parsing & normalization (E.164 format)
- Country detection (NANP, international)
- Area code geolocation (city, state, timezone, coordinates)
- Exchange-level location refinement
- Carrier type detection (heuristic)
- Toll-free / premium rate detection
- Correlation with case annotations
- UI: phone input in CASES panel, results in DETAILS panel

### Phase 2: Enhanced Geospatial Correlation

**Files created**:
| File | Purpose |
|------|---------|
| `src/investigation/osint/geospatial.js` | Reverse geocode, Overpass, place lookup |

**Deliverables**:
- Find CCTV cameras near geolocated phone area
- Cross-reference with local GeoJSON (neighborhoods, regions)
- Place footprint detection (city/region/country)

### Phase 3: Optional API Integration

**Files created**:
| File | Purpose |
|------|---------|
| `src/investigation/osint/data/carrierLookups.js` | Pluggable carrier lookup adapters |

**Deliverables**:
- Twilio Lookup API adapter (optional, paid)
- NumVerify API adapter (optional, paid)
- Configuration for enabling/disabling paid lookups

## 6. UI Integration Design

### 6.1 CASES Panel — Phone Input

Add a phone input field to the CASES panel actions area:

```html
<div class="case-osint-input">
  <input type="tel" placeholder="Enter phone number..." class="osint-phone-input" />
  <button class="osint-correlate-btn">🔍 Correlate</button>
</div>
```

**Behavior**:
1. User enters phone number (e.g., "+1 (512) 555-1234")
2. Clicks "Correlate" or presses Enter
3. Phone number is parsed, validated, geolocated
4. Results stored as annotation with OSINT metadata
5. New annotation created in the active case
6. DETAILS panel opens showing correlation results

### 6.2 DETAILS Panel — Phone OSINT Results

Add a "Phone OSINT" section to the DETAILS panel when the selected annotation has phone-related OSINT data:

```
┌─ Annotation Metadata ────────────────┐
│ Label: [512-555-1234]                 │
│ Source: [manual ▼]                    │
│ Case:  [________]                     │
│                                       │
│ ┌─ Phone OSINT Results ───────────┐ │
│ │                                  │ │
│ │ Parsed Number:                   │ │
│ │   E.164:    +15125551234         │ │
│ │   Country:  United States (US)   │ │
│ │   Format:   (512) 555-1234       │ │
│ │                                  │ │
│ │ Location:                         │ │
│ │   City:     Austin, TX           │ │
│ │   Timezone: America/Chicago      │ │
│ │   UTC:      UTC-6 (UTC-7 DST)    │ │
│ │                                  │ │
│ │ Carrier:                         │ │
│ │   Type:     Unknown (heuristic)  │ │
│ │   Note:     Requires API key for │ │
│ │             accurate detection    │ │
│ │                                  │ │
│ │ Case Correlation:                │ │
│ │   ✓ 2 matching annotations       │ │
│ │   ✓ 3 nearby CCTV cameras        │ │
│ └──────────────────────────────────┘ │
│                                       │
│ [Save] [Cancel]                     │
└───────────────────────────────────────┘
```

## 7. Configuration

```javascript
// OSINT service configuration
const osintConfig = {
  phone: {
    // Optional API keys for enhanced lookups
    twilioApiKey: null,      // Set to enable Twilio Lookup
    numverifyKey: null,      // Set to enable NumVerify
    
    // Local data sources (always available)
    useLocalAreaCodeDb: true,
    useExchangeDb: true,
    
    // Correlation settings
    correlateWithCase: true,  // Cross-reference with case annotations
    findNearbyCameras: true,  // Find CCTV cameras near geolocated area
    nearbyCameraRadius: 5000, // meters for camera search
    
    // Cache settings
    cacheTtlMs: 86400000,    // 24 hours (phone data is static)
  },
  cache: {
    defaultTtlMs: 3600000,   // 1 hour for general results
    storageKey: 'gev_osint_cache',
  },
};
```

## 8. NANP Area Code Database — Sample Data

The area code database will include all active NANP area codes. Here's a sample of the structure:

```javascript
// Key area codes for major cities (comprehensive list in implementation)
export const AREA_CODE_DB = {
  // Texas
  '214': { city: 'Dallas', state: 'TX', timezone: 'America/Chicago', coordinates: [32.7767, -96.7970], alternateCities: ['Irving', 'Garland'] },
  '469': { city: 'Dallas', state: 'TX', timezone: 'America/Chicago', coordinates: [32.7767, -96.7970], alternateCities: [] },
  '512': { city: 'Austin', state: 'TX', timezone: 'America/Chicago', coordinates: [30.2672, -97.7431], alternateCities: ['Round Rock', 'Pflugerville'] },
  '737': { city: 'Austin', state: 'TX', timezone: 'America/Chicago', coordinates: [30.2672, -97.7431], alternateCities: [] },
  '713': { city: 'Houston', state: 'TX', timezone: 'America/Chicago', coordinates: [29.7604, -95.3698], alternateCities: ['Pasadena', 'Baytown'] },
  '281': { city: 'Houston', state: 'TX', timezone: 'America/Chicago', coordinates: [29.7604, -95.3698], alternateCities: [] },
  '832': { city: 'Houston', state: 'TX', timezone: 'America/Chicago', coordinates: [29.7604, -95.3698], alternateCities: [] },
  
  // California
  '213': { city: 'Los Angeles', state: 'CA', timezone: 'America/Los_Angeles', coordinates: [34.0522, -118.2437], alternateCities: ['Downtown LA'] },
  '310': { city: 'Los Angeles', state: 'CA', timezone: 'America/Los_Angeles', coordinates: [34.0522, -118.2437], alternateCities: ['Santa Monica', 'Beverly Hills'] },
  '415': { city: 'San Francisco', state: 'CA', timezone: 'America/Los_Angeles', coordinates: [37.7749, -122.4194], alternateCities: ['SFO'] },
  '650': { city: 'San Mateo', state: 'CA', timezone: 'America/Los_Angeles', coordinates: [37.5630, -122.3255], alternateCities: ['Palo Alto', 'Redwood City'] },
  
  // New York
  '212': { city: 'New York', state: 'NY', timezone: 'America/New_York', coordinates: [40.7128, -74.0060], alternateCities: ['Manhattan', 'Brooklyn'] },
  '646': { city: 'New York', state: 'NY', timezone: 'America/New_York', coordinates: [40.7128, -74.0060], alternateCities: ['Manhattan'] },
  '718': { city: 'Brooklyn', state: 'NY', timezone: 'America/New_York', coordinates: [40.6782, -73.9442], alternateCities: ['Queens', 'Bronx', 'Staten Island'] },
  
  // Florida
  '305': { city: 'Miami', state: 'FL', timezone: 'America/New_York', coordinates: [25.7617, -80.1918], alternateCities: ['Key West'] },
  '407': { city: 'Orlando', state: 'FL', timezone: 'America/New_York', coordinates: [28.5383, -81.3792], alternateCities: ['Kissimmee'] },
  
  // Illinois
  '312': { city: 'Chicago', state: 'IL', timezone: 'America/Chicago', coordinates: [41.8781, -87.6298], alternateCities: ['Loop'] },
  '773': { city: 'Chicago', state: 'IL', timezone: 'America/Chicago', coordinates: [41.8781, -87.6298], alternateCities: ['North Side', 'South Side'] },
  
  // ... comprehensive list of all NANP area codes
};
```

## 9. Open Questions

1. **API integration**: Should we integrate with Twilio Lookup or NumVerify for accurate carrier detection? (Requires API key from user)
2. **International numbers**: How should non-NANP numbers be handled? (Currently: basic parsing + country detection only)
3. **Phone number input format**: Should the input auto-format as the user types? (e.g., "(512) 555-1234")
4. **Bulk correlation**: Should users be able to correlate multiple phone numbers at once?
