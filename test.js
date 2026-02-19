'use strict';

const { parseAddress } = require('./index.js');

let passed = 0;
let failed = 0;

function test(input, expected) {
  const result = parseAddress(input);
  const ok =
    result.street === expected.street &&
    result.city === expected.city &&
    result.state === expected.state &&
    result.zip === expected.zip;

  if (ok) {
    passed++;
  } else {
    failed++;
    console.error(`❌ FAIL: "${input}"`);
    console.error(`   Expected: ${JSON.stringify(expected)}`);
    console.error(`   Got:      ${JSON.stringify(result)}`);
  }
}

// ── Standard formats ──────────────────────────────────────────────────────────
test('14620 W Encanto Blvd STE 110 Goodyear AZ 85395',
  { street: '14620 W Encanto Blvd STE 110', city: 'Goodyear', state: 'AZ', zip: '85395' });

test('1316 W University Dr, Mesa, AZ 85201, USA',
  { street: '1316 W University Dr', city: 'Mesa', state: 'AZ', zip: '85201' });

test('1316 W University Dr, Mesa, AZ 85201, United States',
  { street: '1316 W University Dr', city: 'Mesa', state: 'AZ', zip: '85201' });

test('7012 N 56TH AVE GLENDALE, AZ 85301',
  { street: '7012 N 56TH AVE', city: 'GLENDALE', state: 'AZ', zip: '85301' });

test('924 N Country Club Dr Mesa AZ 85201',
  { street: '924 N Country Club Dr', city: 'Mesa', state: 'AZ', zip: '85201' });

// ── Multi-word cities ─────────────────────────────────────────────────────────
test('14510 W Shumway Dr STE 100 Sun City West AZ 85375',
  { street: '14510 W Shumway Dr STE 100', city: 'Sun City West', state: 'AZ', zip: '85375' });

test('36453 N Gantzel Rd San Tan Valley AZ 85140',
  { street: '36453 N Gantzel Rd', city: 'San Tan Valley', state: 'AZ', zip: '85140' });

test('4411 W Paseo Way, Laveen Village, AZ 85339, USA',
  { street: '4411 W Paseo Way', city: 'Laveen Village', state: 'AZ', zip: '85339' });

test('8131 W Sandy Ln UNIT 1 Arizona City AZ 85123',
  { street: '8131 W Sandy Ln UNIT 1', city: 'Arizona City', state: 'AZ', zip: '85123' });

// ── Apartments / units / suites ───────────────────────────────────────────────
test('163 E Glenn St APT 1102 Tucson AZ 85705',
  { street: '163 E Glenn St APT 1102', city: 'Tucson', state: 'AZ', zip: '85705' });

test('5401 E Thomas Rd apt 1020 Phoenix AZ 85018',
  { street: '5401 E Thomas Rd apt 1020', city: 'Phoenix', state: 'AZ', zip: '85018' });

test('1033 N PARKSIDE DR D413 TEMPE, AZ 85288',
  { street: '1033 N PARKSIDE DR D413', city: 'TEMPE', state: 'AZ', zip: '85288' });

test('4415 S 28th St Apt-354 Phoenix AZ 85040',
  { street: '4415 S 28th St Apt-354', city: 'Phoenix', state: 'AZ', zip: '85040' });

test('1930 S Alma School Rd STE B120 Mesa AZ 85210',
  { street: '1930 S Alma School Rd STE B120', city: 'Mesa', state: 'AZ', zip: '85210' });

test('5740 N 59TH AVE APT 1137 BLDG 15 GLENDALE, AZ 85301',
  { street: '5740 N 59TH AVE APT 1137 BLDG 15', city: 'GLENDALE', state: 'AZ', zip: '85301' });

test('1817 N Dobson Rd 2057 bldg 10, Chandler, AZ 85224, USA',
  { street: '1817 N Dobson Rd 2057 bldg 10', city: 'Chandler', state: 'AZ', zip: '85224' });

test('2433 W MAIN ST BUILDING 9 APART 135 MESA, AZ 85201',
  { street: '2433 W MAIN ST BUILDING 9 APART 135', city: 'MESA', state: 'AZ', zip: '85201' });

// ── Tricky / edge cases ───────────────────────────────────────────────────────
test('316 Ave A APT 61 Casa Grande AZ 85122',
  { street: '316 Ave A APT 61', city: 'Casa Grande', state: 'AZ', zip: '85122' });

test('300 W 287 Florence AZ 85132',
  { street: '300 W 287', city: 'Florence', state: 'AZ', zip: '85132' });

test('10320 W MCDOWELL STE. L1238 AVONDALE, AZ 85392',
  { street: '10320 W MCDOWELL STE. L1238', city: 'AVONDALE', state: 'AZ', zip: '85392' });

test('2045 S Vineyard SUITE 131 Mesa AZ 85210',
  { street: '2045 S Vineyard SUITE 131', city: 'Mesa', state: 'AZ', zip: '85210' });

test('3511 E BASELINE UNIT 1077 PHOENIX, AZ 85042',
  { street: '3511 E BASELINE UNIT 1077', city: 'PHOENIX', state: 'AZ', zip: '85042' });

test('6611 W GLENDALE AVE 4306 BLDG D GLENDALE, AZ 85301',
  { street: '6611 W GLENDALE AVE 4306 BLDG D', city: 'GLENDALE', state: 'AZ', zip: '85301' });

test('16025 S 50TH ST 2038 PHOENIX, AZ 85048',
  { street: '16025 S 50TH ST 2038', city: 'PHOENIX', state: 'AZ', zip: '85048' });

test('4136 N 75TH AVE 116 PHOENIX AZ 85033',
  { street: '4136 N 75TH AVE 116', city: 'PHOENIX', state: 'AZ', zip: '85033' });

// ── Facility name between street and city ─────────────────────────────────────
test('14502 W Meeker Blvd BANNER DEL E. WEBB EMERGENCY DEPT Sun City West AZ 85375',
  { street: '14502 W Meeker Blvd BANNER DEL E. WEBB EMERGENCY DEPT', city: 'Sun City West', state: 'AZ', zip: '85375' });

test('5933 E Main St White Trailer Unit 121 N Mesa AZ 85206',
  { street: '5933 E Main St White Trailer Unit 121 N', city: 'Mesa', state: 'AZ', zip: '85206' });

// ── Partial addresses ─────────────────────────────────────────────────────────
test('77 E. Columbus Ave',
  { street: '77 E. Columbus Ave', city: '', state: '', zip: '' });

test('77 E. Columbus Ave PHOENIX, AZ 85012',
  { street: '77 E. Columbus Ave', city: 'PHOENIX', state: 'AZ', zip: '85012' });

test('Phoenix, AZ 85012',
  { street: '', city: 'Phoenix', state: 'AZ', zip: '85012' });

test('',
  { street: '', city: '', state: '', zip: '' });

// ── Lot / trailer ─────────────────────────────────────────────────────────────
test('1775 N Broad St trailer 72 Globe AZ 85501',
  { street: '1775 N Broad St trailer 72', city: 'Globe', state: 'AZ', zip: '85501' });

test('8301 N 103rd Ave LOT 73 Peoria AZ 85345',
  { street: '8301 N 103rd Ave LOT 73', city: 'Peoria', state: 'AZ', zip: '85345' });

// ── Results ───────────────────────────────────────────────────────────────────
console.log(`\n${passed} passed, ${failed} failed out of ${passed + failed} tests`);
if (failed > 0) process.exit(1);
