# us-address-parser

Parse US address strings into `street`, `city`, `state`, and `zip` components.

Handles messy real-world formats: apartments, suites, buildings, lots, multi-word city names, partial addresses, mixed case, and more.

## Installation

```bash
npm install us-address-parser
```

## Usage

### CommonJS
```js
const { parseAddress } = require('us-address-parser');
```

### ESM
```js
import { parseAddress } from 'us-address-parser';
```

### TypeScript
```ts
import { parseAddress, ParsedAddress } from 'us-address-parser';
```

## Examples

```js
parseAddress('14620 W Encanto Blvd STE 110 Goodyear AZ 85395')
// → { street: '14620 W Encanto Blvd STE 110', city: 'Goodyear', state: 'AZ', zip: '85395' }

parseAddress('1316 W University Dr, Mesa, AZ 85201, USA')
// → { street: '1316 W University Dr', city: 'Mesa', state: 'AZ', zip: '85201' }

parseAddress('14510 W Shumway Dr STE 100 Sun City West AZ 85375')
// → { street: '14510 W Shumway Dr STE 100', city: 'Sun City West', state: 'AZ', zip: '85375' }

parseAddress('1033 N PARKSIDE DR D413 TEMPE, AZ 85288')
// → { street: '1033 N PARKSIDE DR D413', city: 'TEMPE', state: 'AZ', zip: '85288' }

parseAddress('5740 N 59TH AVE APT 1137 BLDG 15 GLENDALE, AZ 85301')
// → { street: '5740 N 59TH AVE APT 1137 BLDG 15', city: 'GLENDALE', state: 'AZ', zip: '85301' }

parseAddress('77 E. Columbus Ave')
// → { street: '77 E. Columbus Ave', city: '', state: '', zip: '' }

parseAddress('Phoenix, AZ 85012')
// → { street: '', city: 'Phoenix', state: 'AZ', zip: '85012' }
```

## What it handles

| Format | Example |
|--------|---------|
| Standard comma-separated | `123 Main St, Springfield, IL 62701` |
| No commas | `123 Main St Springfield IL 62701` |
| With `USA` or `United States` suffix | `123 Main St, Mesa, AZ 85201, USA` |
| Apartments / units | `163 E Glenn St APT 1102 Tucson AZ 85705` |
| Suites | `926 E McDowell Rd STE 100 Phoenix AZ 85006` |
| Buildings | `5740 N 59th Ave BLDG 15 APT 1137 Glendale AZ 85301` |
| Lot numbers | `8301 N 103rd Ave LOT 73 Peoria AZ 85345` |
| Trailers | `1775 N Broad St Trailer 72 Globe AZ 85501` |
| Alphanumeric units | `1033 N Parkside Dr D413 Tempe AZ 85288` |
| Multi-word cities | `36453 N Gantzel Rd San Tan Valley AZ 85140` |
| Facility names | `14502 W Meeker Blvd Banner Del Webb ER Sun City West AZ 85375` |
| Mixed / ALL CAPS | `7012 N 56TH AVE GLENDALE, AZ 85301` |
| Street-only (partial) | `77 E. Columbus Ave` |
| City/state/zip-only (partial) | `Phoenix, AZ 85012` |

## Return value

```ts
{
  street: string;  // Street address + unit info
  city: string;    // City name
  state: string;   // 2-letter state abbreviation
  zip: string;     // 5-digit ZIP code
}
```

All fields return an empty string `""` if not found.

## Adding cities

The parser uses a built-in list of common US cities. If you need to support additional or less common cities, you can extend the parser for your use case — the `KNOWN_CITIES` array in `index.js` is the place to add them.

## License

MIT
