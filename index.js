'use strict';

/**
 * Known US cities — multi-word entries must come before single-word ones
 * so the longest match wins.
 */
const KNOWN_CITIES = [
  'SUN CITY WEST', 'SAN TAN VALLEY', 'QUEEN CREEK', 'APACHE JUNCTION',
  'CASA GRANDE', 'EL MIRAGE', 'ARIZONA CITY', 'LITCHFIELD PARK',
  'LAVEEN VILLAGE', 'LAVEEN', 'SUN CITY', 'SUNLAKES', 'WITTMANN',
  'APACHI JUNCTION', 'YOUNGTOWN', 'TONOPAH', 'SACATON', 'WITTMAN',
  'PHOENIX', 'MESA', 'GLENDALE', 'TEMPE', 'CHANDLER', 'SCOTTSDALE',
  'GILBERT', 'PEORIA', 'SURPRISE', 'GOODYEAR', 'AVONDALE', 'TUCSON',
  'MARICOPA', 'TOLLESON', 'GLOBE', 'FLORENCE', 'COOLIDGE', 'BUCKEYE',
  'ELOY', 'WICKENBURG', 'PAYSON', 'ROOSEVELT', 'WADDELL',
  // Common US cities across all states
  'NEW YORK', 'LOS ANGELES', 'SAN FRANCISCO', 'SAN DIEGO', 'SAN JOSE',
  'SAN ANTONIO', 'FORT WORTH', 'EL PASO', 'OKLAHOMA CITY', 'KANSAS CITY',
  'LONG BEACH', 'VIRGINIA BEACH', 'COLORADO SPRINGS', 'NEW ORLEANS',
  'LAS VEGAS', 'SALT LAKE CITY', 'BATON ROUGE', 'SANTA ANA', 'ST PAUL',
  'ST LOUIS', 'ST PETERSBURG', 'CORPUS CHRISTI', 'SANTA CLARITA',
  'FORT WAYNE', 'JERSEY CITY', 'PORT ARTHUR', 'GRAND RAPIDS',
  'NORTH LAS VEGAS', 'CHULA VISTA', 'BOCA RATON', 'CAPE CORAL',
  'PALM BAY', 'WEST PALM BEACH', 'FORT LAUDERDALE', 'PEMBROKE PINES',
  'PORT ST LUCIE', 'TALLAHASSEE', 'JACKSON', 'BIRMINGHAM', 'HUNTSVILLE',
  'LITTLE ROCK', 'SHREVEPORT', 'BATON ROUGE', 'CEDAR RAPIDS',
  'DES MOINES', 'SIOUX FALLS', 'RAPID CITY', 'BILLINGS', 'MISSOULA',
  'SPOKANE', 'TACOMA', 'BELLEVUE', 'PORTLAND', 'EUGENE', 'SALEM',
  'CHICAGO', 'HOUSTON', 'DALLAS', 'DETROIT', 'NASHVILLE', 'MEMPHIS',
  'LOUISVILLE', 'BALTIMORE', 'MILWAUKEE', 'ALBUQUERQUE', 'TUCSON',
  'FRESNO', 'SACRAMENTO', 'DENVER', 'BOSTON', 'SEATTLE', 'OMAHA',
  'CLEVELAND', 'MIAMI', 'RALEIGH', 'MINNEAPOLIS', 'TULSA', 'WICHITA',
  'ARLINGTON', 'BAKERSFIELD', 'AURORA', 'ANAHEIM', 'SANTA ROSA',
  'RIVERSIDE', 'STOCKTON', 'CINCINNATI', 'PITTSBURGH', 'GREENSBORO',
  'TOLEDO', 'LINCOLN', 'HENDERSON', 'BUFFALO', 'ANCHORAGE', 'NEWARK',
  'PLANO', 'IRVINE', 'ORLANDO', 'MADISON', 'DURHAM', 'LUBBOCK',
  'WINSTON', 'GARLAND', 'LAREDO', 'NORFOLK', 'RENO', 'ST LOUIS',
  'CHANDLER', 'SCOTTSDALE', 'HIALEAH', 'FREMONT', 'RICHMOND',
  'BOISE', 'BIRMINGHAM', 'ROCHESTER', 'SPOKANE', 'KNOXVILLE',
  'OXNARD', 'TACOMA', 'PROVIDENCE', 'HARTFORD', 'WORCESTER',
  'BRIDGEPORT', 'HAVEN', 'SPRINGFIELD', 'COLUMBIA', 'LEXINGTON',
  'AURORA', 'FORT COLLINS', 'THORNTON', 'LAKEWOOD', 'WESTMINSTER',
  'CAPE CORAL', 'TALLAHASSEE', 'JACKSONVILLE',
];

const STREET_SUFFIXES = new Set([
  'ST', 'AVE', 'DR', 'RD', 'BLVD', 'LN', 'WAY', 'PL', 'CT', 'CIR',
  'LOOP', 'PKWY', 'HWY', 'TRL', 'FWY', 'EXPY', 'SQ', 'XING', 'RUN',
  'PATH', 'PIKE', 'PASS', 'ROW', 'WALK', 'TRCE', 'CV', 'GLN', 'HOLW',
  'KNLS', 'MDW', 'MDWS', 'MT', 'MTN', 'RDG', 'RNCH', 'SHRS', 'SPG',
  'SPGS', 'VLY', 'VIS', 'VW', 'BND', 'FRK', 'FRKS', 'KY', 'BCH', 'BR',
  'CLB', 'COR', 'CORS', 'CP', 'CSWY', 'DL', 'DM', 'DV', 'EST', 'ESTS',
  'FLD', 'FLDS', 'FLS', 'FRD', 'GRN', 'GRV', 'HBR', 'HL', 'HLS', 'INLT',
  'VINEYARD',
]);

const UNIT_KEYWORDS = new Set([
  'APT', 'UNIT', 'STE', 'SUITE', 'BLDG', 'BUILDING', 'LOT',
  'RM', 'ROOM', 'TRAILER', 'FLOOR', 'FL', 'DEPT', 'PMB', 'APART',
]);

/**
 * Try to match a known city at the END of a string.
 * Returns { street, city } or null.
 * @param {string} s
 */
function extractKnownCity(s) {
  const upper = s.toUpperCase();
  const sorted = [...KNOWN_CITIES].sort((a, b) => b.length - a.length);
  for (const city of sorted) {
    if (upper.endsWith(city)) {
      const remainder = s.slice(0, s.length - city.length).trim().replace(/,\s*$/, '').trim();
      return { street: remainder, city: s.slice(s.length - city.length) };
    }
  }
  return null;
}

/**
 * Parse a US address string into its components.
 *
 * @param {string} address - Raw address string
 * @returns {{ street: string, city: string, state: string, zip: string }}
 */
function parseAddress(address) {
  if (!address || !address.trim()) {
    return { street: '', city: '', state: '', zip: '' };
  }

  let addr = address.trim();

  // Strip country suffix
  addr = addr.replace(/,?\s*(USA|United States)\s*$/i, '').trim();

  // ── Extract ZIP (5-digit at end) ──────────────────────────────────────────
  let zip = '';
  const zipMatch = addr.match(/\b(\d{5})\s*$/);
  if (zipMatch) {
    zip = zipMatch[1];
    addr = addr.slice(0, addr.lastIndexOf(zipMatch[0])).trim().replace(/,\s*$/, '').trim();
  }

  // ── Extract STATE (2-letter abbreviation at end) ──────────────────────────
  let state = '';
  const stateMatch = addr.match(/,?\s*\b([A-Z]{2})\s*$/i);
  if (stateMatch) {
    state = stateMatch[1].toUpperCase();
    addr = addr.slice(0, addr.lastIndexOf(stateMatch[0])).trim().replace(/,\s*$/, '').trim();
  }

  if (!addr) return { street: '', city: '', state, zip };

  let street = '';
  let city = '';

  // ── Strategy 1: comma-separated → split on last comma ────────────────────
  if (addr.includes(',')) {
    const lastComma = addr.lastIndexOf(',');
    street = addr.slice(0, lastComma).trim();
    city = addr.slice(lastComma + 1).trim();

  // ── Strategy 2: no leading number → city-only (or street-only) fragment ───
  } else if (!/^\d/.test(addr)) {
    if (state || zip) {
      city = addr;
    } else {
      street = addr;
    }

  // ── Strategy 3: starts with a number → parse street + city ───────────────
  } else {
    const words = addr.split(/\s+/);

    // Find last street suffix — skip "Ave A" pattern (suffix followed by single letter)
    let streetEndIdx = -1;
    for (let i = 0; i < words.length; i++) {
      const w = words[i].replace(/[.,#]/g, '').toUpperCase();
      if (STREET_SUFFIXES.has(w)) {
        const nextWord = words[i + 1] ? words[i + 1].replace(/[.,#]/g, '') : '';
        if (nextWord.length === 1 && /^[A-Za-z]$/.test(nextWord)) continue;
        streetEndIdx = i;
      }
    }

    if (streetEndIdx === -1) {
      // No suffix — try known-city extraction from end
      const cityMatch = extractKnownCity(addr);
      if (cityMatch) {
        street = cityMatch.street;
        city = cityMatch.city;
      } else {
        street = addr;
        city = '';
      }
    } else {
      // Walk past unit/apt/bldg/facility tokens after the suffix
      let idx = streetEndIdx + 1;

      while (idx < words.length) {
        const w = words[idx].replace(/[.,#]/g, '').toUpperCase();

        if (UNIT_KEYWORDS.has(w)) {
          idx++; // consume keyword
          // Consume value tokens until we reach a known city
          while (idx < words.length) {
            const possibleCity = words.slice(idx).join(' ');
            const cityAtEnd = extractKnownCity(possibleCity);
            if (cityAtEnd && cityAtEnd.street.trim() === '') break;
            const vw = words[idx].replace(/[.,#]/g, '').toUpperCase();
            if (
              /^\d+[A-Z]?$/i.test(vw) ||
              /^[A-Z]\d+$/i.test(vw) ||
              /^[A-Z]-\d+$/i.test(vw)
            ) {
              idx++;
            } else if (!extractKnownCity(words.slice(idx).join(' '))) {
              idx++;
            } else {
              break;
            }
          }
        } else if (
          /^\d+[A-Z]?$/i.test(words[idx]) ||
          /^[A-Z]\d+$/i.test(words[idx]) ||
          /^[A-Z]-\d+$/i.test(words[idx]) ||
          /^#/.test(words[idx])
        ) {
          idx++;
        } else {
          break;
        }
      }

      street = words.slice(0, idx).join(' ');
      city = words.slice(idx).join(' ');

      // Absorb any facility text that leaked into city
      if (city) {
        const cityMatch = extractKnownCity(city);
        if (cityMatch && cityMatch.street.trim() !== '') {
          street = (street + ' ' + cityMatch.street).trim();
          city = cityMatch.city;
        }
      }
    }
  }

  street = street.replace(/[.,]+$/, '').trim();
  city = city.replace(/[.,]+$/, '').trim();

  return { street, city, state, zip };
}

module.exports = { parseAddress };
module.exports.default = parseAddress;
