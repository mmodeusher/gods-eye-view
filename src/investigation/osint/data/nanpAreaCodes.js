/**
 * NANP Area Code Database
 * 
 * North American Numbering Plan area codes with geolocation data.
 * This database maps area codes to cities, states, and coordinates
 * for phone number geolocation without requiring external APIs.
 * 
 * Data source: FCC allocations and NANPA assignments
 */

/**
 * @typedef {Object} AreaCodeInfo
 * @property {string} city - Primary city name
 * @property {string} state - State abbreviation (e.g., "TX", "CA")
 * @property {number} latitude - Center latitude
 * @property {number} longitude - Center longitude
 * @property {string[]} [counties] - List of counties served
 * @property {'primary' | 'secondary'} type - Whether this is a primary or secondary area code for the location
 */

/**
 * Area code database keyed by 3-digit area code string
 * @type {Record<string, AreaCodeInfo>}
 */
const AREA_CODES = {
  // Alabama (205, 251, 659)
  '205': {
    city: 'Birmingham',
    state: 'AL',
    latitude: 33.5186,
    longitude: -86.8104,
    counties: ['Jefferson', 'Shelby', 'St. Clair', 'Blount'],
    type: 'primary'
  },
  '251': {
    city: 'Mobile',
    state: 'AL',
    latitude: 30.6954,
    longitude: -88.0399,
    counties: ['Mobile', 'Baldwin'],
    type: 'primary'
  },
  '659': {
    city: 'Birmingham',
    state: 'AL',
    latitude: 33.5186,
    longitude: -86.8104,
    counties: ['Jefferson', 'Shelby'],
    type: 'secondary'
  },

  // Alaska (907)
  '907': {
    city: 'Anchorage',
    state: 'AK',
    latitude: 61.2181,
    longitude: -149.9003,
    counties: ['Municipality of Anchorage'],
    type: 'primary'
  },

  // Arizona (480, 520, 602, 623, 680)
  '480': {
    city: 'Phoenix',
    state: 'AZ',
    latitude: 33.4484,
    longitude: -111.9400,
    counties: ['Maricopa'],
    type: 'primary'
  },
  '520': {
    city: 'Tucson',
    state: 'AZ',
    latitude: 32.2226,
    longitude: -110.9747,
    counties: ['Pima'],
    type: 'primary'
  },
  '602': {
    city: 'Phoenix',
    state: 'AZ',
    latitude: 33.4484,
    longitude: -111.9400,
    counties: ['Maricopa'],
    type: 'primary'
  },
  '623': {
    city: 'Glendale',
    state: 'AZ',
    latitude: 33.5387,
    longitude: -112.1859,
    counties: ['Maricopa'],
    type: 'primary'
  },
  '680': {
    city: 'Phoenix',
    state: 'AZ',
    latitude: 33.4484,
    longitude: -111.9400,
    counties: ['Maricopa'],
    type: 'secondary'
  },

  // Arkansas (479, 501, 870)
  '479': {
    city: 'Fayetteville',
    state: 'AR',
    latitude: 36.0626,
    longitude: -94.1574,
    counties: ['Washington'],
    type: 'primary'
  },
  '501': {
    city: 'Little Rock',
    state: 'AR',
    latitude: 34.7465,
    longitude: -92.2896,
    counties: ['Pulaski'],
    type: 'primary'
  },
  '870': {
    city: 'Jonesboro',
    state: 'AR',
    latitude: 35.8423,
    longitude: -90.7042,
    counties: ['Craighead'],
    type: 'primary'
  },

  // California (various major area codes)
  '213': {
    city: 'Los Angeles',
    state: 'CA',
    latitude: 34.0522,
    longitude: -118.2437,
    counties: ['Los Angeles'],
    type: 'primary'
  },
  '310': {
    city: 'Beverly Hills',
    state: 'CA',
    latitude: 34.0736,
    longitude: -118.4004,
    counties: ['Los Angeles'],
    type: 'primary'
  },
  '323': {
    city: 'Los Angeles',
    state: 'CA',
    latitude: 34.0522,
    longitude: -118.2437,
    counties: ['Los Angeles'],
    type: 'primary'
  },
  '415': {
    city: 'San Francisco',
    state: 'CA',
    latitude: 37.7749,
    longitude: -122.4194,
    counties: ['San Francisco'],
    type: 'primary'
  },
  '510': {
    city: 'Oakland',
    state: 'CA',
    latitude: 37.8044,
    longitude: -122.2712,
    counties: ['Alameda'],
    type: 'primary'
  },
  '562': {
    city: 'Long Beach',
    state: 'CA',
    latitude: 33.7701,
    longitude: -118.1937,
    counties: ['Los Angeles'],
    type: 'primary'
  },
  '619': {
    city: 'San Diego',
    state: 'CA',
    latitude: 32.7157,
    longitude: -117.1611,
    counties: ['San Diego'],
    type: 'primary'
  },
  '626': {
    city: 'Pasadena',
    state: 'CA',
    latitude: 34.1478,
    longitude: -118.1445,
    counties: ['Los Angeles'],
    type: 'primary'
  },
  '628': {
    city: 'San Francisco',
    state: 'CA',
    latitude: 37.7749,
    longitude: -122.4194,
    counties: ['San Francisco'],
    type: 'secondary'
  },
  '650': {
    city: 'Palo Alto',
    state: 'CA',
    latitude: 37.4419,
    longitude: -122.1430,
    counties: ['San Mateo'],
    type: 'primary'
  },
  '657': {
    city: 'Anaheim',
    state: 'CA',
    latitude: 33.8366,
    longitude: -117.9143,
    counties: ['Orange'],
    type: 'secondary'
  },
  '707': {
    city: 'Santa Rosa',
    state: 'CA',
    latitude: 38.4404,
    longitude: -122.7144,
    counties: ['Sonoma'],
    type: 'primary'
  },
  '714': {
    city: 'Anaheim',
    state: 'CA',
    latitude: 33.8366,
    longitude: -117.9143,
    counties: ['Orange'],
    type: 'primary'
  },
  '805': {
    city: 'Santa Barbara',
    state: 'CA',
    latitude: 34.4208,
    longitude: -119.6982,
    counties: ['Santa Barbara'],
    type: 'primary'
  },
  '818': {
    city: 'Burbank',
    state: 'CA',
    latitude: 34.1808,
    longitude: -118.3090,
    counties: ['Los Angeles'],
    type: 'primary'
  },
  '916': {
    city: 'Sacramento',
    state: 'CA',
    latitude: 38.5816,
    longitude: -121.4944,
    counties: ['Sacramento'],
    type: 'primary'
  },
  '925': {
    city: 'Concord',
    state: 'CA',
    latitude: 37.9789,
    longitude: -122.0311,
    counties: ['Contra Costa'],
    type: 'primary'
  },

  // Colorado (303, 719, 720, 970)
  '303': {
    city: 'Denver',
    state: 'CO',
    latitude: 39.7392,
    longitude: -104.9903,
    counties: ['Denver', 'Jefferson'],
    type: 'primary'
  },
  '719': {
    city: 'Colorado Springs',
    state: 'CO',
    latitude: 38.8339,
    longitude: -104.8214,
    counties: ['El Paso'],
    type: 'primary'
  },
  '720': {
    city: 'Denver',
    state: 'CO',
    latitude: 39.7392,
    longitude: -104.9903,
    counties: ['Denver', 'Jefferson', 'Arapahoe'],
    type: 'secondary'
  },
  '970': {
    city: 'Fort Collins',
    state: 'CO',
    latitude: 40.5853,
    longitude: -105.0844,
    counties: ['Larimer'],
    type: 'primary'
  },

  // Connecticut (203, 475, 860)
  '203': {
    city: 'Bridgeport',
    state: 'CT',
    latitude: 41.1865,
    longitude: -73.1952,
    counties: ['Fairfield'],
    type: 'primary'
  },
  '475': {
    city: 'Bridgeport',
    state: 'CT',
    latitude: 41.1865,
    longitude: -73.1952,
    counties: ['Fairfield'],
    type: 'secondary'
  },
  '860': {
    city: 'Hartford',
    state: 'CT',
    latitude: 41.7658,
    longitude: -72.6734,
    counties: ['Hartford'],
    type: 'primary'
  },

  // Delaware (302)
  '302': {
    city: 'Wilmington',
    state: 'DE',
    latitude: 39.7460,
    longitude: -75.5466,
    counties: ['New Castle'],
    type: 'primary'
  },

  // District of Columbia (202)
  '202': {
    city: 'Washington',
    state: 'DC',
    latitude: 38.9072,
    longitude: -77.0369,
    counties: ['District of Columbia'],
    type: 'primary'
  },

  // Florida (various major area codes)
  '239': {
    city: 'Fort Myers',
    state: 'FL',
    latitude: 26.6406,
    longitude: -81.8723,
    counties: ['Lee'],
    type: 'primary'
  },
  '305': {
    city: 'Miami',
    state: 'FL',
    latitude: 25.7617,
    longitude: -80.1918,
    counties: ['Miami-Dade'],
    type: 'primary'
  },
  '321': {
    city: 'Orlando',
    state: 'FL',
    latitude: 28.5383,
    longitude: -81.3792,
    counties: ['Orange'],
    type: 'secondary'
  },
  '352': {
    city: 'Gainesville',
    state: 'FL',
    latitude: 29.6516,
    longitude: -82.3248,
    counties: ['Alachua'],
    type: 'primary'
  },
  '386': {
    city: 'Daytona Beach',
    state: 'FL',
    latitude: 29.2108,
    longitude: -81.0228,
    counties: ['Volusia'],
    type: 'primary'
  },
  '407': {
    city: 'Orlando',
    state: 'FL',
    latitude: 28.5383,
    longitude: -81.3792,
    counties: ['Orange', 'Seminole'],
    type: 'primary'
  },
  '561': {
    city: 'West Palm Beach',
    state: 'FL',
    latitude: 26.7153,
    longitude: -80.0534,
    counties: ['Palm Beach'],
    type: 'primary'
  },
  '727': {
    city: 'St. Petersburg',
    state: 'FL',
    latitude: 27.7676,
    longitude: -82.6403,
    counties: ['Pinellas'],
    type: 'primary'
  },
  '754': {
    city: 'Fort Lauderdale',
    state: 'FL',
    latitude: 26.1224,
    longitude: -80.1373,
    counties: ['Broward'],
    type: 'secondary'
  },
  '786': {
    city: 'Miami',
    state: 'FL',
    latitude: 25.7617,
    longitude: -80.1918,
    counties: ['Miami-Dade'],
    type: 'secondary'
  },
  '813': {
    city: 'Tampa',
    state: 'FL',
    latitude: 27.9506,
    longitude: -82.4572,
    counties: ['Hillsborough'],
    type: 'primary'
  },
  '863': {
    city: 'Lakeland',
    state: 'FL',
    latitude: 28.0395,
    longitude: -81.9498,
    counties: ['Polk'],
    type: 'primary'
  },
  '904': {
    city: 'Jacksonville',
    state: 'FL',
    latitude: 30.3322,
    longitude: -81.6557,
    counties: ['Duval'],
    type: 'primary'
  },
  '954': {
    city: 'Fort Lauderdale',
    state: 'FL',
    latitude: 26.1224,
    longitude: -80.1373,
    counties: ['Broward'],
    type: 'primary'
  },

  // Georgia (229, 404, 470, 478, 678, 706, 762, 770, 912)
  '229': {
    city: 'Albany',
    state: 'GA',
    latitude: 31.5804,
    longitude: -84.1557,
    counties: ['Dougherty'],
    type: 'primary'
  },
  '404': {
    city: 'Atlanta',
    state: 'GA',
    latitude: 33.7490,
    longitude: -84.3880,
    counties: ['Fulton'],
    type: 'primary'
  },
  '470': {
    city: 'Atlanta',
    state: 'GA',
    latitude: 33.7490,
    longitude: -84.3880,
    counties: ['Fulton'],
    type: 'secondary'
  },
  '478': {
    city: 'Macon',
    state: 'GA',
    latitude: 32.8407,
    longitude: -83.6324,
    counties: ['Bibb'],
    type: 'primary'
  },
  '678': {
    city: 'Atlanta',
    state: 'GA',
    latitude: 33.7490,
    longitude: -84.3880,
    counties: ['Fulton', 'DeKalb'],
    type: 'secondary'
  },
  '706': {
    city: 'Augusta',
    state: 'GA',
    latitude: 33.4735,
    longitude: -82.0105,
    counties: ['Richmond'],
    type: 'primary'
  },
  '762': {
    city: 'Augusta',
    state: 'GA',
    latitude: 33.4735,
    longitude: -82.0105,
    counties: ['Richmond'],
    type: 'secondary'
  },
  '770': {
    city: 'Atlanta',
    state: 'GA',
    latitude: 33.7490,
    longitude: -84.3880,
    counties: ['Fulton', 'Cobb', 'Douglas'],
    type: 'secondary'
  },
  '912': {
    city: 'Savannah',
    state: 'GA',
    latitude: 32.0809,
    longitude: -81.0912,
    counties: ['Chatham'],
    type: 'primary'
  },

  // Hawaii (808)
  '808': {
    city: 'Honolulu',
    state: 'HI',
    latitude: 21.3069,
    longitude: -157.8583,
    counties: ['Honolulu'],
    type: 'primary'
  },

  // Idaho (208)
  '208': {
    city: 'Boise',
    state: 'ID',
    latitude: 43.6150,
    longitude: -116.2023,
    counties: ['Ada'],
    type: 'primary'
  },

  // Illinois (217, 309, 312, 618, 708, 773, 819)
  '217': {
    city: 'Springfield',
    state: 'IL',
    latitude: 39.7817,
    longitude: -89.6501,
    counties: ['Sangamon'],
    type: 'primary'
  },
  '309': {
    city: 'Peoria',
    state: 'IL',
    latitude: 40.6936,
    longitude: -89.5890,
    counties: ['Peoria'],
    type: 'primary'
  },
  '312': {
    city: 'Chicago',
    state: 'IL',
    latitude: 41.8781,
    longitude: -87.6298,
    counties: ['Cook'],
    type: 'primary'
  },
  '618': {
    city: 'Springfield',
    state: 'IL',
    latitude: 39.7817,
    longitude: -89.6501,
    counties: ['Sangamon'],
    type: 'secondary'
  },
  '708': {
    city: 'Chicago',
    state: 'IL',
    latitude: 41.8781,
    longitude: -87.6298,
    counties: ['Cook'],
    type: 'secondary'
  },
  '773': {
    city: 'Chicago',
    state: 'IL',
    latitude: 41.8781,
    longitude: -87.6298,
    counties: ['Cook'],
    type: 'secondary'
  },

  // Indiana (219, 260, 317, 463, 574, 765, 812)
  '219': {
    city: 'Gary',
    state: 'IN',
    latitude: 41.5934,
    longitude: -87.3464,
    counties: ['Lake'],
    type: 'primary'
  },
  '260': {
    city: 'Fort Wayne',
    state: 'IN',
    latitude: 41.0793,
    longitude: -85.1394,
    counties: ['Allen'],
    type: 'primary'
  },
  '317': {
    city: 'Indianapolis',
    state: 'IN',
    latitude: 39.7684,
    longitude: -86.1581,
    counties: ['Marion'],
    type: 'primary'
  },
  '463': {
    city: 'Indianapolis',
    state: 'IN',
    latitude: 39.7684,
    longitude: -86.1581,
    counties: ['Marion'],
    type: 'secondary'
  },
  '574': {
    city: 'South Bend',
    state: 'IN',
    latitude: 41.6764,
    longitude: -86.2520,
    counties: ['St. Joseph'],
    type: 'primary'
  },
  '765': {
    city: 'Lafayette',
    state: 'IN',
    latitude: 40.4167,
    longitude: -86.8753,
    counties: ['Tippecanoe'],
    type: 'primary'
  },
  '812': {
    city: 'Evansville',
    state: 'IN',
    latitude: 37.9716,
    longitude: -87.5719,
    counties: ['Vanderburgh'],
    type: 'primary'
  },

  // Iowa (319, 515, 563, 641, 712)
  '319': {
    city: 'Cedar Rapids',
    state: 'IA',
    latitude: 41.9778,
    longitude: -91.6656,
    counties: ['Linn'],
    type: 'primary'
  },
  '515': {
    city: 'Des Moines',
    state: 'IA',
    latitude: 41.5911,
    longitude: -93.6037,
    counties: ['Polk'],
    type: 'primary'
  },
  '563': {
    city: 'Davenport',
    state: 'IA',
    latitude: 41.5236,
    longitude: -90.5776,
    counties: ['Scott'],
    type: 'primary'
  },
  '641': {
    city: 'Mason City',
    state: 'IA',
    latitude: 43.1549,
    longitude: -93.2010,
    counties: ['Crow Wing'],
    type: 'primary'
  },
  '712': {
    city: 'Sioux City',
    state: 'IA',
    latitude: 42.4999,
    longitude: -96.4003,
    counties: ['Woodbury'],
    type: 'primary'
  },

  // Kansas (316, 620, 785, 913)
  '316': {
    city: 'Wichita',
    state: 'KS',
    latitude: 37.6872,
    longitude: -97.3301,
    counties: ['Sedgwick'],
    type: 'primary'
  },
  '620': {
    city: 'Hutchinson',
    state: 'KS',
    latitude: 38.0608,
    longitude: -97.9296,
    counties: ['Rice'],
    type: 'primary'
  },
  '785': {
    city: 'Topeka',
    state: 'KS',
    latitude: 39.0473,
    longitude: -95.6890,
    counties: ['Shawnee'],
    type: 'primary'
  },
  '913': {
    city: 'Kansas City',
    state: 'KS',
    latitude: 39.1142,
    longitude: -94.6275,
    counties: ['Johnson'],
    type: 'primary'
  },

  // Kentucky (270, 364, 502, 606, 859)
  '270': {
    city: 'Paducah',
    state: 'KY',
    latitude: 37.0831,
    longitude: -88.6031,
    counties: ['McCracken'],
    type: 'primary'
  },
  '364': {
    city: 'Bowling Green',
    state: 'KY',
    latitude: 36.9859,
    longitude: -86.4888,
    counties: ['Warren'],
    type: 'secondary'
  },
  '502': {
    city: 'Louisville',
    state: 'KY',
    latitude: 38.2527,
    longitude: -85.7585,
    counties: ['Jefferson'],
    type: 'primary'
  },
  '606': {
    city: 'Ashland',
    state: 'KY',
    latitude: 38.4281,
    longitude: -82.6543,
    counties: ['Floyd'],
    type: 'primary'
  },
  '859': {
    city: 'Lexington',
    state: 'KY',
    latitude: 38.0406,
    longitude: -84.5037,
    counties: ['Fayette'],
    type: 'primary'
  },

  // Louisiana (225, 318, 337, 504, 985)
  '225': {
    city: 'Baton Rouge',
    state: 'LA',
    latitude: 30.4581,
    longitude: -91.1402,
    counties: ['East Baton Rouge'],
    type: 'primary'
  },
  '318': {
    city: 'Shreveport',
    state: 'LA',
    latitude: 32.5252,
    longitude: -93.7502,
    counties: ['Caddo'],
    type: 'primary'
  },
  '337': {
    city: 'Lafayette',
    state: 'LA',
    latitude: 30.2241,
    longitude: -92.0198,
    counties: ['Lafayette'],
    type: 'primary'
  },
  '504': {
    city: 'New Orleans',
    state: 'LA',
    latitude: 29.9511,
    longitude: -90.0715,
    counties: ['Orleans'],
    type: 'primary'
  },
  '985': {
    city: 'Houma',
    state: 'LA',
    latitude: 29.5958,
    longitude: -90.7195,
    counties: ['Terrebonne'],
    type: 'primary'
  },

  // Maine (207)
  '207': {
    city: 'Portland',
    state: 'ME',
    latitude: 43.6591,
    longitude: -70.2568,
    counties: ['Cumberland'],
    type: 'primary'
  },

  // Maryland (240, 301, 410, 443, 667)
  '240': {
    city: 'Silver Spring',
    state: 'MD',
    latitude: 38.9950,
    longitude: -77.0115,
    counties: ['Montgomery'],
    type: 'secondary'
  },
  '301': {
    city: 'Silver Spring',
    state: 'MD',
    latitude: 38.9950,
    longitude: -77.0115,
    counties: ['Montgomery', 'Prince George\'s'],
    type: 'primary'
  },
  '410': {
    city: 'Baltimore',
    state: 'MD',
    latitude: 39.2904,
    longitude: -76.6122,
    counties: ['Baltimore'],
    type: 'primary'
  },
  '443': {
    city: 'Baltimore',
    state: 'MD',
    latitude: 39.2904,
    longitude: -76.6122,
    counties: ['Baltimore'],
    type: 'secondary'
  },
  '667': {
    city: 'Baltimore',
    state: 'MD',
    latitude: 39.2904,
    longitude: -76.6122,
    counties: ['Baltimore'],
    type: 'tertiary'
  },

  // Massachusetts (339, 413, 508, 617, 774, 781, 857, 874)
  '339': {
    city: 'Boston',
    state: 'MA',
    latitude: 42.3601,
    longitude: -71.0589,
    counties: ['Suffolk'],
    type: 'secondary'
  },
  '413': {
    city: 'Springfield',
    state: 'MA',
    latitude: 42.1015,
    longitude: -72.5898,
    counties: ['Hampden'],
    type: 'primary'
  },
  '508': {
    city: 'Worcester',
    state: 'MA',
    latitude: 42.2626,
    longitude: -71.8023,
    counties: ['Worcester'],
    type: 'primary'
  },
  '617': {
    city: 'Boston',
    state: 'MA',
    latitude: 42.3601,
    longitude: -71.0589,
    counties: ['Suffolk'],
    type: 'primary'
  },
  '774': {
    city: 'Worcester',
    state: 'MA',
    latitude: 42.2626,
    longitude: -71.8023,
    counties: ['Worcester'],
    type: 'secondary'
  },
  '781': {
    city: 'Boston',
    state: 'MA',
    latitude: 42.3601,
    longitude: -71.0589,
    counties: ['Suffolk', 'Middlesex'],
    type: 'secondary'
  },
  '857': {
    city: 'Boston',
    state: 'MA',
    latitude: 42.3601,
    longitude: -71.0589,
    counties: ['Suffolk'],
    type: 'secondary'
  },

  // Michigan (231, 248, 269, 313, 517, 586, 616, 734, 810, 906, 947, 989)
  '231': {
    city: 'Traverse City',
    state: 'MI',
    latitude: 44.7631,
    longitude: -85.6206,
    counties: ['Grand Traverse'],
    type: 'primary'
  },
  '248': {
    city: 'Troy',
    state: 'MI',
    latitude: 42.6053,
    longitude: -83.1499,
    counties: ['Oakland'],
    type: 'primary'
  },
  '269': {
    city: 'Kalamazoo',
    state: 'MI',
    latitude: 42.2917,
    longitude: -85.5802,
    counties: ['Kalamazoo'],
    type: 'primary'
  },
  '313': {
    city: 'Detroit',
    state: 'MI',
    latitude: 42.3314,
    longitude: -83.0458,
    counties: ['Wayne'],
    type: 'primary'
  },
  '517': {
    city: 'Lansing',
    state: 'MI',
    latitude: 42.7335,
    longitude: -84.5555,
    counties: ['Ingham'],
    type: 'primary'
  },
  '586': {
    city: 'Warren',
    state: 'MI',
    latitude: 42.4891,
    longitude: -83.0077,
    counties: ['Macomb'],
    type: 'primary'
  },
  '616': {
    city: 'Grand Rapids',
    state: 'MI',
    latitude: 42.9634,
    longitude: -85.6681,
    counties: ['Kent'],
    type: 'primary'
  },
  '734': {
    city: 'Ann Arbor',
    state: 'MI',
    latitude: 42.2808,
    longitude: -83.7430,
    counties: ['Washtenaw'],
    type: 'primary'
  },
  '810': {
    city: 'Flint',
    state: 'MI',
    latitude: 43.0125,
    longitude: -83.6875,
    counties: ['Genesee'],
    type: 'primary'
  },
  '906': {
    city: 'Marquette',
    state: 'MI',
    latitude: 46.5454,
    longitude: -87.3995,
    counties: ['Marquette'],
    type: 'primary'
  },
  '947': {
    city: 'Troy',
    state: 'MI',
    latitude: 42.6053,
    longitude: -83.1499,
    counties: ['Oakland'],
    type: 'secondary'
  },
  '989': {
    city: 'Saginaw',
    state: 'MI',
    latitude: 43.4297,
    longitude: -83.9508,
    counties: ['Saginaw'],
    type: 'primary'
  },

  // Minnesota (218, 320, 507, 612, 763, 952)
  '218': {
    city: 'Duluth',
    state: 'MN',
    latitude: 46.7866,
    longitude: -92.1001,
    counties: ['St. Louis'],
    type: 'primary'
  },
  '320': {
    city: 'St. Cloud',
    state: 'MN',
    latitude: 45.5608,
    longitude: -94.1624,
    counties: ['Stearns'],
    type: 'primary'
  },
  '507': {
    city: 'Rochester',
    state: 'MN',
    latitude: 43.8910,
    longitude: -92.4606,
    counties: ['Olmsted'],
    type: 'primary'
  },
  '612': {
    city: 'Minneapolis',
    state: 'MN',
    latitude: 44.9778,
    longitude: -93.2650,
    counties: ['Hennepin'],
    type: 'primary'
  },
  '763': {
    city: 'Minneapolis',
    state: 'MN',
    latitude: 44.9778,
    longitude: -93.2650,
    counties: ['Hennepin'],
    type: 'secondary'
  },
  '952': {
    city: 'Minneapolis',
    state: 'MN',
    latitude: 44.9778,
    longitude: -93.2650,
    counties: ['Hennepin'],
    type: 'secondary'
  },

  // Mississippi (228, 601, 662, 769, 845)
  '228': {
    city: 'Gulfport',
    state: 'MS',
    latitude: 30.3674,
    longitude: -89.0928,
    counties: ['Harrison'],
    type: 'primary'
  },
  '601': {
    city: 'Jackson',
    state: 'MS',
    latitude: 32.2988,
    longitude: -90.1848,
    counties: ['Hinds'],
    type: 'primary'
  },
  '662': {
    city: 'Oxford',
    state: 'MS',
    latitude: 34.3525,
    longitude: -89.5307,
    counties: ['Lafayette'],
    type: 'primary'
  },
  '769': {
    city: 'Jackson',
    state: 'MS',
    latitude: 32.2988,
    longitude: -90.1848,
    counties: ['Hinds'],
    type: 'secondary'
  },

  // Missouri (314, 417, 573, 636, 660, 816)
  '314': {
    city: 'St. Louis',
    state: 'MO',
    latitude: 38.6270,
    longitude: -90.1994,
    counties: ['St. Louis City'],
    type: 'primary'
  },
  '417': {
    city: 'Springfield',
    state: 'MO',
    latitude: 37.2090,
    longitude: -93.2923,
    counties: ['Greene'],
    type: 'primary'
  },
  '573': {
    city: 'Columbia',
    state: 'MO',
    latitude: 38.9517,
    longitude: -92.3341,
    counties: ['Boone'],
    type: 'primary'
  },
  '636': {
    city: 'St. Charles',
    state: 'MO',
    latitude: 38.7881,
    longitude: -90.4837,
    counties: ['St. Charles'],
    type: 'primary'
  },
  '660': {
    city: 'Sedalia',
    state: 'MO',
    latitude: 38.4040,
    longitude: -93.2527,
    counties: ['Pettis'],
    type: 'primary'
  },
  '816': {
    city: 'Kansas City',
    state: 'MO',
    latitude: 39.0997,
    longitude: -94.5786,
    counties: ['Jackson'],
    type: 'primary'
  },

  // Montana (406)
  '406': {
    city: 'Billings',
    state: 'MT',
    latitude: 45.7833,
    longitude: -108.5007,
    counties: ['Yellowstone'],
    type: 'primary'
  },

  // Nebraska (308, 402, 531)
  '308': {
    city: 'North Platte',
    state: 'NE',
    latitude: 41.1236,
    longitude: -100.7657,
    counties: ['Lincoln'],
    type: 'primary'
  },
  '402': {
    city: 'Omaha',
    state: 'NE',
    latitude: 41.2565,
    longitude: -95.9345,
    counties: ['Douglas'],
    type: 'primary'
  },
  '531': {
    city: 'Omaha',
    state: 'NE',
    latitude: 41.2565,
    longitude: -95.9345,
    counties: ['Douglas'],
    type: 'secondary'
  },

  // Nevada (702, 725, 775)
  '702': {
    city: 'Las Vegas',
    state: 'NV',
    latitude: 36.1699,
    longitude: -115.1398,
    counties: ['Clark'],
    type: 'primary'
  },
  '725': {
    city: 'Las Vegas',
    state: 'NV',
    latitude: 36.1699,
    longitude: -115.1398,
    counties: ['Clark'],
    type: 'secondary'
  },
  '775': {
    city: 'Reno',
    state: 'NV',
    latitude: 39.5296,
    longitude: -119.8138,
    counties: ['Washoe'],
    type: 'primary'
  },

  // New Hampshire (603)
  '603': {
    city: 'Manchester',
    state: 'NH',
    latitude: 42.9956,
    longitude: -71.4548,
    counties: ['Hillsborough'],
    type: 'primary'
  },

  // New Jersey (201, 240, 267, 310, 484, 609, 600, 610, 732, 856, 862, 908, 973)
  '201': {
    city: 'Jersey City',
    state: 'NJ',
    latitude: 40.7178,
    longitude: -74.0431,
    counties: ['Hudson'],
    type: 'primary'
  },
  '609': {
    city: 'Trenton',
    state: 'NJ',
    latitude: 40.2206,
    longitude: -74.7429,
    counties: ['Mercer'],
    type: 'primary'
  },
  '732': {
    city: 'New Brunswick',
    state: 'NJ',
    latitude: 40.4862,
    longitude: -74.4518,
    counties: ['Middlesex'],
    type: 'primary'
  },
  '856': {
    city: 'Camden',
    state: 'NJ',
    latitude: 39.9259,
    longitude: -75.1196,
    counties: ['Camden'],
    type: 'primary'
  },
  '862': {
    city: 'Newark',
    state: 'NJ',
    latitude: 40.7357,
    longitude: -74.1724,
    counties: ['Essex'],
    type: 'secondary'
  },
  '908': {
    city: 'Elizabeth',
    state: 'NJ',
    latitude: 40.6640,
    longitude: -74.2107,
    counties: ['Union'],
    type: 'primary'
  },
  '973': {
    city: 'Newark',
    state: 'NJ',
    latitude: 40.7357,
    longitude: -74.1724,
    counties: ['Essex'],
    type: 'primary'
  },

  // New Mexico (505, 575)
  '505': {
    city: 'Albuquerque',
    state: 'NM',
    latitude: 35.0844,
    longitude: -106.6504,
    counties: ['Bernalillo'],
    type: 'primary'
  },
  '575': {
    city: 'Las Cruces',
    state: 'NM',
    latitude: 32.3199,
    longitude: -106.7637,
    counties: ['Doña Ana'],
    type: 'primary'
  },

  // New York (212, 315, 332, 347, 516, 518, 585, 607, 631, 646, 680, 716, 718, 845, 914, 917, 929)
  '212': {
    city: 'New York',
    state: 'NY',
    latitude: 40.7128,
    longitude: -74.0060,
    counties: ['New York'],
    type: 'primary'
  },
  '315': {
    city: 'Syracuse',
    state: 'NY',
    latitude: 43.0481,
    longitude: -76.1474,
    counties: ['Onondaga'],
    type: 'primary'
  },
  '332': {
    city: 'New York',
    state: 'NY',
    latitude: 40.7128,
    longitude: -74.0060,
    counties: ['New York'],
    type: 'secondary'
  },
  '347': {
    city: 'New York',
    state: 'NY',
    latitude: 40.7128,
    longitude: -74.0060,
    counties: ['New York'],
    type: 'secondary'
  },
  '516': {
    city: 'Hempstead',
    state: 'NY',
    latitude: 40.7265,
    longitude: -73.6187,
    counties: ['Nassau'],
    type: 'primary'
  },
  '518': {
    city: 'Albany',
    state: 'NY',
    latitude: 42.6526,
    longitude: -73.7562,
    counties: ['Albany'],
    type: 'primary'
  },
  '585': {
    city: 'Rochester',
    state: 'NY',
    latitude: 43.1566,
    longitude: -77.6088,
    counties: ['Monroe'],
    type: 'primary'
  },
  '607': {
    city: 'Binghamton',
    state: 'NY',
    latitude: 42.0987,
    longitude: -75.9105,
    counties: ['Broome'],
    type: 'primary'
  },
  '631': {
    city: 'Huntington',
    state: 'NY',
    latitude: 40.8688,
    longitude: -73.3952,
    counties: ['Suffolk'],
    type: 'primary'
  },
  '646': {
    city: 'New York',
    state: 'NY',
    latitude: 40.7128,
    longitude: -74.0060,
    counties: ['New York'],
    type: 'secondary'
  },
  '716': {
    city: 'Buffalo',
    state: 'NY',
    latitude: 42.8864,
    longitude: -78.8784,
    counties: ['Erie'],
    type: 'primary'
  },
  '718': {
    city: 'New York',
    state: 'NY',
    latitude: 40.7128,
    longitude: -74.0060,
    counties: ['Kings', 'Queens', 'Bronx', 'Richmond'],
    type: 'primary'
  },
  '845': {
    city: 'Poughkeepsie',
    state: 'NY',
    latitude: 41.7004,
    longitude: -73.9209,
    counties: ['Dutchess'],
    type: 'primary'
  },
  '914': {
    city: 'White Plains',
    state: 'NY',
    latitude: 41.0340,
    longitude: -73.7629,
    counties: ['Westchester'],
    type: 'primary'
  },
  '917': {
    city: 'New York',
    state: 'NY',
    latitude: 40.7128,
    longitude: -74.0060,
    counties: ['New York'],
    type: 'mobile'
  },
  '929': {
    city: 'New York',
    state: 'NY',
    latitude: 40.7128,
    longitude: -74.0060,
    counties: ['New York'],
    type: 'secondary'
  },

  // North Carolina (252, 336, 704, 743, 828, 910, 919, 980)
  '252': {
    city: 'Greenville',
    state: 'NC',
    latitude: 35.6127,
    longitude: -77.3663,
    counties: ['Pitt'],
    type: 'primary'
  },
  '336': {
    city: 'Greensboro',
    state: 'NC',
    latitude: 36.0726,
    longitude: -79.7920,
    counties: ['Guilford'],
    type: 'primary'
  },
  '704': {
    city: 'Charlotte',
    state: 'NC',
    latitude: 35.2271,
    longitude: -80.8431,
    counties: ['Mecklenburg'],
    type: 'primary'
  },
  '743': {
    city: 'Raleigh',
    state: 'NC',
    latitude: 35.7796,
    longitude: -78.6382,
    counties: ['Wake'],
    type: 'secondary'
  },
  '828': {
    city: 'Asheville',
    state: 'NC',
    latitude: 35.5951,
    longitude: -82.5515,
    counties: ['Buncombe'],
    type: 'primary'
  },
  '910': {
    city: 'Fayetteville',
    state: 'NC',
    latitude: 35.0527,
    longitude: -78.8784,
    counties: ['Cumberland'],
    type: 'primary'
  },
  '919': {
    city: 'Raleigh',
    state: 'NC',
    latitude: 35.7796,
    longitude: -78.6382,
    counties: ['Wake', 'Durham'],
    type: 'primary'
  },
  '980': {
    city: 'Charlotte',
    state: 'NC',
    latitude: 35.2271,
    longitude: -80.8431,
    counties: ['Mecklenburg'],
    type: 'secondary'
  },

  // North Dakota (701)
  '701': {
    city: 'Fargo',
    state: 'ND',
    latitude: 46.8772,
    longitude: -96.7898,
    counties: ['Cass'],
    type: 'primary'
  },

  // Ohio (216, 220, 330, 380, 419, 440, 513, 614, 740, 937)
  '216': {
    city: 'Cleveland',
    state: 'OH',
    latitude: 41.4993,
    longitude: -81.6944,
    counties: ['Cuyahoga'],
    type: 'primary'
  },
  '220': {
    city: 'Columbus',
    state: 'OH',
    latitude: 39.9612,
    longitude: -82.9988,
    counties: ['Franklin'],
    type: 'secondary'
  },
  '330': {
    city: 'Akron',
    state: 'OH',
    latitude: 41.0814,
    longitude: -81.5190,
    counties: ['Summit'],
    type: 'primary'
  },
  '380': {
    city: 'Columbus',
    state: 'OH',
    latitude: 39.9612,
    longitude: -82.9988,
    counties: ['Franklin'],
    type: 'secondary'
  },
  '419': {
    city: 'Toledo',
    state: 'OH',
    latitude: 41.6528,
    longitude: -83.5379,
    counties: ['Lucas'],
    type: 'primary'
  },
  '440': {
    city: 'Elyria',
    state: 'OH',
    latitude: 41.3609,
    longitude: -82.1077,
    counties: ['Lorain'],
    type: 'primary'
  },
  '513': {
    city: 'Cincinnati',
    state: 'OH',
    latitude: 39.1031,
    longitude: -84.5120,
    counties: ['Hamilton'],
    type: 'primary'
  },
  '614': {
    city: 'Columbus',
    state: 'OH',
    latitude: 39.9612,
    longitude: -82.9988,
    counties: ['Franklin'],
    type: 'primary'
  },
  '740': {
    city: 'Zanesville',
    state: 'OH',
    latitude: 39.9408,
    longitude: -82.0127,
    counties: ['Muskingum'],
    type: 'primary'
  },
  '937': {
    city: 'Dayton',
    state: 'OH',
    latitude: 39.7589,
    longitude: -84.1916,
    counties: ['Montgomery'],
    type: 'primary'
  },

  // Oklahoma (405, 539, 580, 918)
  '405': {
    city: 'Oklahoma City',
    state: 'OK',
    latitude: 35.4676,
    longitude: -97.5164,
    counties: ['Oklahoma'],
    type: 'primary'
  },
  '539': {
    city: 'Oklahoma City',
    state: 'OK',
    latitude: 35.4676,
    longitude: -97.5164,
    counties: ['Oklahoma'],
    type: 'secondary'
  },
  '580': {
    city: 'Lawton',
    state: 'OK',
    latitude: 34.6085,
    longitude: -98.3927,
    counties: ['Comanche'],
    type: 'primary'
  },
  '918': {
    city: 'Tulsa',
    state: 'OK',
    latitude: 36.1540,
    longitude: -95.9928,
    counties: ['Osage'],
    type: 'primary'
  },

  // Oregon (458, 503, 541, 971)
  '458': {
    city: 'Eugene',
    state: 'OR',
    latitude: 44.0521,
    longitude: -123.0868,
    counties: ['Lane'],
    type: 'secondary'
  },
  '503': {
    city: 'Portland',
    state: 'OR',
    latitude: 45.5152,
    longitude: -122.6784,
    counties: ['Multnomah'],
    type: 'primary'
  },
  '541': {
    city: 'Eugene',
    state: 'OR',
    latitude: 44.0521,
    longitude: -123.0868,
    counties: ['Lane'],
    type: 'primary'
  },
  '971': {
    city: 'Portland',
    state: 'OR',
    latitude: 45.5152,
    longitude: -122.6784,
    counties: ['Multnomah'],
    type: 'secondary'
  },

  // Pennsylvania (215, 223, 267, 272, 412, 484, 570, 610, 717, 724, 814, 878)
  '215': {
    city: 'Philadelphia',
    state: 'PA',
    latitude: 39.9526,
    longitude: -75.1652,
    counties: ['Philadelphia'],
    type: 'primary'
  },
  '223': {
    city: 'Philadelphia',
    state: 'PA',
    latitude: 39.9526,
    longitude: -75.1652,
    counties: ['Philadelphia'],
    type: 'secondary'
  },
  '267': {
    city: 'Philadelphia',
    state: 'PA',
    latitude: 39.9526,
    longitude: -75.1652,
    counties: ['Philadelphia'],
    type: 'secondary'
  },
  '272': {
    city: 'Scranton',
    state: 'PA',
    latitude: 41.4090,
    longitude: -75.6624,
    counties: ['Lackawanna'],
    type: 'secondary'
  },
  '412': {
    city: 'Pittsburgh',
    state: 'PA',
    latitude: 40.4406,
    longitude: -79.9959,
    counties: ['Allegheny'],
    type: 'primary'
  },
  '484': {
    city: 'Allentown',
    state: 'PA',
    latitude: 40.6084,
    longitude: -75.4902,
    counties: ['Lehigh'],
    type: 'secondary'
  },
  '570': {
    city: 'Scranton',
    state: 'PA',
    latitude: 41.4090,
    longitude: -75.6624,
    counties: ['Lackawanna'],
    type: 'primary'
  },
  '610': {
    city: 'Reading',
    state: 'PA',
    latitude: 40.3356,
    longitude: -75.9269,
    counties: ['Berks'],
    type: 'primary'
  },
  '717': {
    city: 'Harrisburg',
    state: 'PA',
    latitude: 40.2732,
    longitude: -76.8867,
    counties: ['Dauphin'],
    type: 'primary'
  },
  '724': {
    city: 'Greensburg',
    state: 'PA',
    latitude: 40.3015,
    longitude: -79.5396,
    counties: ['Westmoreland'],
    type: 'primary'
  },
  '814': {
    city: 'Altoona',
    state: 'PA',
    latitude: 40.5187,
    longitude: -78.3946,
    counties: ['Blair'],
    type: 'primary'
  },
  '878': {
    city: 'Pittsburgh',
    state: 'PA',
    latitude: 40.4406,
    longitude: -79.9959,
    counties: ['Allegheny'],
    type: 'secondary'
  },

  // Rhode Island (401)
  '401': {
    city: 'Providence',
    state: 'RI',
    latitude: 41.8240,
    longitude: -71.4128,
    counties: ['Providence'],
    type: 'primary'
  },

  // South Carolina (803, 843, 854, 864)
  '803': {
    city: 'Columbia',
    state: 'SC',
    latitude: 34.0007,
    longitude: -81.0348,
    counties: ['Richland'],
    type: 'primary'
  },
  '843': {
    city: 'Charleston',
    state: 'SC',
    latitude: 32.7765,
    longitude: -79.9311,
    counties: ['Dorchester'],
    type: 'primary'
  },
  '854': {
    city: 'Charleston',
    state: 'SC',
    latitude: 32.7765,
    longitude: -79.9311,
    counties: ['Dorchester'],
    type: 'secondary'
  },
  '864': {
    city: 'Greenville',
    state: 'SC',
    latitude: 34.8526,
    longitude: -82.3940,
    counties: ['Greenville'],
    type: 'primary'
  },

  // South Dakota (605)
  '605': {
    city: 'Sioux Falls',
    state: 'SD',
    latitude: 43.5446,
    longitude: -96.7311,
    counties: ['Minnehaha'],
    type: 'primary'
  },

  // Tennessee (423, 615, 629, 731, 865, 901, 931)
  '423': {
    city: 'Chattanooga',
    state: 'TN',
    latitude: 35.0456,
    longitude: -85.3097,
    counties: ['Hamilton'],
    type: 'primary'
  },
  '615': {
    city: 'Nashville',
    state: 'TN',
    latitude: 36.1627,
    longitude: -86.7816,
    counties: ['Davidson'],
    type: 'primary'
  },
  '629': {
    city: 'Nashville',
    state: 'TN',
    latitude: 36.1627,
    longitude: -86.7816,
    counties: ['Davidson'],
    type: 'secondary'
  },
  '731': {
    city: 'Jackson',
    state: 'TN',
    latitude: 35.1495,
    longitude: -88.8165,
    counties: ['Madison'],
    type: 'primary'
  },
  '865': {
    city: 'Knoxville',
    state: 'TN',
    latitude: 35.9606,
    longitude: -83.9207,
    counties: ['Knox'],
    type: 'primary'
  },
  '901': {
    city: 'Memphis',
    state: 'TN',
    latitude: 35.1495,
    longitude: -90.0490,
    counties: ['Shelby'],
    type: 'primary'
  },
  '931': {
    city: 'Cookeville',
    state: 'TN',
    latitude: 36.1628,
    longitude: -85.5016,
    counties: ['Putnam'],
    type: 'primary'
  },

  // Texas (various major area codes)
  '214': {
    city: 'Dallas',
    state: 'TX',
    latitude: 32.7767,
    longitude: -96.7970,
    counties: ['Dallas'],
    type: 'primary'
  },
  '254': {
    city: 'Waco',
    state: 'TX',
    latitude: 31.5493,
    longitude: -97.1466,
    counties: ['McLennan'],
    type: 'primary'
  },
  '281': {
    city: 'Houston',
    state: 'TX',
    latitude: 29.7604,
    longitude: -95.3698,
    counties: ['Harris'],
    type: 'secondary'
  },
  '325': {
    city: 'San Angelo',
    state: 'TX',
    latitude: 31.4638,
    longitude: -100.4370,
    counties: ['Tom Green'],
    type: 'primary'
  },
  '361': {
    city: 'Corpus Christi',
    state: 'TX',
    latitude: 27.8006,
    longitude: -97.3964,
    counties: ['Nueces'],
    type: 'primary'
  },
  '409': {
    city: 'Beaumont',
    state: 'TX',
    latitude: 30.0802,
    longitude: -94.1019,
    counties: ['Jefferson'],
    type: 'primary'
  },
  '432': {
    city: 'Midland',
    state: 'TX',
    latitude: 31.9973,
    longitude: -102.0779,
    counties: ['Midland'],
    type: 'primary'
  },
  '469': {
    city: 'Dallas',
    state: 'TX',
    latitude: 32.7767,
    longitude: -96.7970,
    counties: ['Dallas'],
    type: 'secondary'
  },
  '512': {
    city: 'Austin',
    state: 'TX',
    latitude: 30.2672,
    longitude: -97.7431,
    counties: ['Travis'],
    type: 'primary'
  },
  '682': {
    city: 'Fort Worth',
    state: 'TX',
    latitude: 32.7555,
    longitude: -97.3308,
    counties: ['Tarrant'],
    type: 'secondary'
  },
  '713': {
    city: 'Houston',
    state: 'TX',
    latitude: 29.7604,
    longitude: -95.3698,
    counties: ['Harris'],
    type: 'primary'
  },
  '737': {
    city: 'Austin',
    state: 'TX',
    latitude: 30.2672,
    longitude: -97.7431,
    counties: ['Travis'],
    type: 'secondary'
  },
  '806': {
    city: 'Lubbock',
    state: 'TX',
    latitude: 33.5779,
    longitude: -101.8552,
    counties: ['Lubbock'],
    type: 'primary'
  },
  '817': {
    city: 'Fort Worth',
    state: 'TX',
    latitude: 32.7555,
    longitude: -97.3308,
    counties: ['Tarrant'],
    type: 'primary'
  },
  '830': {
    city: 'San Marcos',
    state: 'TX',
    latitude: 29.8833,
    longitude: -97.9413,
    counties: ['Hays'],
    type: 'primary'
  },
  '832': {
    city: 'Houston',
    state: 'TX',
    latitude: 29.7604,
    longitude: -95.3698,
    counties: ['Harris'],
    type: 'secondary'
  },
  '903': {
    city: 'Tyler',
    state: 'TX',
    latitude: 32.3513,
    longitude: -95.3011,
    counties: ['Smith'],
    type: 'primary'
  },
  '915': {
    city: 'El Paso',
    state: 'TX',
    latitude: 31.7619,
    longitude: -106.4850,
    counties: ['El Paso'],
    type: 'primary'
  },
  '936': {
    city: 'College Station',
    state: 'TX',
    latitude: 30.6280,
    longitude: -96.3344,
    counties: ['Brazos'],
    type: 'primary'
  },
  '940': {
    city: 'Wichita Falls',
    state: 'TX',
    latitude: 33.9137,
    longitude: -98.4934,
    counties: ['Wichita'],
    type: 'primary'
  },
  '956': {
    city: 'Brownsville',
    state: 'TX',
    latitude: 25.9017,
    longitude: -97.4975,
    counties: ['Cameron'],
    type: 'primary'
  },
  '972': {
    city: 'Dallas',
    state: 'TX',
    latitude: 32.7767,
    longitude: -96.7970,
    counties: ['Dallas'],
    type: 'secondary'
  },

  // Utah (385, 435, 801)
  '385': {
    city: 'Salt Lake City',
    state: 'UT',
    latitude: 40.7608,
    longitude: -111.8910,
    counties: ['Salt Lake'],
    type: 'secondary'
  },
  '435': {
    city: 'St. George',
    state: 'UT',
    latitude: 37.0965,
    longitude: -113.5684,
    counties: ['Washington'],
    type: 'primary'
  },
  '801': {
    city: 'Salt Lake City',
    state: 'UT',
    latitude: 40.7608,
    longitude: -111.8910,
    counties: ['Salt Lake'],
    type: 'primary'
  },

  // Vermont (802)
  '802': {
    city: 'Burlington',
    state: 'VT',
    latitude: 44.4759,
    longitude: -73.2121,
    counties: ['Chittenden'],
    type: 'primary'
  },

  // Virginia (276, 434, 540, 571, 703, 757, 804)
  '276': {
    city: 'Bristol',
    state: 'VA',
    latitude: 36.6327,
    longitude: -82.1749,
    counties: ['Washington'],
    type: 'primary'
  },
  '434': {
    city: 'Lynchburg',
    state: 'VA',
    latitude: 37.4138,
    longitude: -79.1422,
    counties: ['Lynchburg City'],
    type: 'primary'
  },
  '540': {
    city: 'Roanoke',
    state: 'VA',
    latitude: 37.2710,
    longitude: -79.9395,
    counties: ['Roanoke City'],
    type: 'primary'
  },
  '571': {
    city: 'Arlington',
    state: 'VA',
    latitude: 38.8816,
    longitude: -77.0910,
    counties: ['Arlington'],
    type: 'secondary'
  },
  '703': {
    city: 'Arlington',
    state: 'VA',
    latitude: 38.8816,
    longitude: -77.0910,
    counties: ['Arlington'],
    type: 'primary'
  },
  '757': {
    city: 'Virginia Beach',
    state: 'VA',
    latitude: 36.8529,
    longitude: -75.9780,
    counties: ['Virginia Beach City'],
    type: 'primary'
  },
  '804': {
    city: 'Richmond',
    state: 'VA',
    latitude: 37.5407,
    longitude: -77.4360,
    counties: ['Henrico', 'Chesterfield'],
    type: 'primary'
  },

  // Washington (206, 253, 360, 425, 509)
  '206': {
    city: 'Seattle',
    state: 'WA',
    latitude: 47.6062,
    longitude: -122.3321,
    counties: ['King'],
    type: 'primary'
  },
  '253': {
    city: 'Tacoma',
    state: 'WA',
    latitude: 47.2529,
    longitude: -122.4443,
    counties: ['Pierce'],
    type: 'primary'
  },
  '360': {
    city: 'Olympia',
    state: 'WA',
    latitude: 47.0379,
    longitude: -122.9007,
    counties: ['Thurston'],
    type: 'primary'
  },
  '425': {
    city: 'Bellevue',
    state: 'WA',
    latitude: 47.6104,
    longitude: -122.2007,
    counties: ['King'],
    type: 'primary'
  },
  '509': {
    city: 'Spokane',
    state: 'WA',
    latitude: 47.6588,
    longitude: -117.4260,
    counties: ['Spokane'],
    type: 'primary'
  },

  // West Virginia (304, 681)
  '304': {
    city: 'Charleston',
    state: 'WV',
    latitude: 38.3498,
    longitude: -81.6326,
    counties: ['Kanawha'],
    type: 'primary'
  },
  '681': {
    city: 'Charleston',
    state: 'WV',
    latitude: 38.3498,
    longitude: -81.6326,
    counties: ['Kanawha'],
    type: 'secondary'
  },

  // Wisconsin (262, 414, 534, 608, 715, 920)
  '262': {
    city: 'Kenosha',
    state: 'WI',
    latitude: 42.5847,
    longitude: -87.8213,
    counties: ['Kenosha'],
    type: 'primary'
  },
  '414': {
    city: 'Milwaukee',
    state: 'WI',
    latitude: 43.0389,
    longitude: -87.9065,
    counties: ['Milwaukee'],
    type: 'primary'
  },
  '534': {
    city: 'Milwaukee',
    state: 'WI',
    latitude: 43.0389,
    longitude: -87.9065,
    counties: ['Milwaukee'],
    type: 'secondary'
  },
  '608': {
    city: 'Madison',
    state: 'WI',
    latitude: 43.0731,
    longitude: -89.4012,
    counties: ['Dane'],
    type: 'primary'
  },
  '715': {
    city: 'Wausau',
    state: 'WI',
    latitude: 44.9591,
    longitude: -89.6301,
    counties: ['Marathon'],
    type: 'primary'
  },
  '920': {
    city: 'Green Bay',
    state: 'WI',
    latitude: 44.5133,
    longitude: -88.0133,
    counties: ['Brown'],
    type: 'primary'
  },

  // Wyoming (307)
  '307': {
    city: 'Cheyenne',
    state: 'WY',
    latitude: 41.1400,
    longitude: -104.8202,
    counties: ['Laramie'],
    type: 'primary'
  }
};

/**
 * Toll-free area codes (800, 888, 877, 866, 855, 844, 833)
 */
const TOLL_FREE_CODES = ['800', '888', '877', '866', '855', '844', '833'];

/**
 * Premium rate area codes (900, 920, 930, 940, 950, 960, 970, 980, 990)
 */
const PREMIUM_RATE_CODES = ['900', '920', '930', '940', '950', '960', '970', '980', '990'];

/**
 * Get area code information by 3-digit code
 * @param {string} areaCode - 3-digit area code
 * @returns {{ city: string, state: string, latitude: number, longitude: number, type: string } | null}
 */
export function getAreaCodeInfo(areaCode) {
  if (!areaCode || areaCode.length !== 3) {
    return null;
  }

  // Check toll-free codes
  if (TOLL_FREE_CODES.includes(areaCode)) {
    return {
      city: 'Toll-Free',
      state: 'US',
      latitude: 39.8283,
      longitude: -98.5795,
      type: 'toll-free'
    };
  }

  // Check premium rate codes
  if (PREMIUM_RATE_CODES.includes(areaCode)) {
    return {
      city: 'Premium Rate',
      state: 'US',
      latitude: 39.8283,
      longitude: -98.5795,
      type: 'premium'
    };
  }

  return AREA_CODES[areaCode] || null;
}

/**
 * Get all states that have area codes
 * @returns {string[]} Array of state abbreviations
 */
export function getStates() {
  const states = new Set();
  Object.values(AREA_CODES).forEach((info) => {
    states.add(info.state);
  });
  return Array.from(states).sort();
}

/**
 * Get area codes for a specific state
 * @param {string} stateAbbrev - State abbreviation (e.g., "CA")
 * @returns {string[]} Array of area codes
 */
export function getAreaCodesByState(stateAbbrev) {
  return Object.entries(AREA_CODES)
    .filter(([, info]) => info.state === stateAbbrev)
    .map(([code]) => code);
}

/**
 * Find the closest city for a given latitude/longitude
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} [maxDistance=100] - Maximum distance in miles
 * @returns {{ city: string, state: string, distance: number } | null}
 */
export function findNearestCity(lat, lon, maxDistance = 100) {
  let closest = null;
  let minDistance = Infinity;

  Object.values(AREA_CODES).forEach((info) => {
    const distance = haversineDistance(lat, lon, info.latitude, info.longitude);
    if (distance < minDistance && distance <= maxDistance) {
      minDistance = distance;
      closest = { city: info.city, state: info.state, distance };
    }
  });

  return closest;
}

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - First point latitude
 * @param {number} lon1 - First point longitude
 * @param {number} lat2 - Second point latitude
 * @param {number} lon2 - Second point longitude
 * @returns {number} Distance in miles
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

export { AREA_CODES, TOLL_FREE_CODES, PREMIUM_RATE_CODES };
