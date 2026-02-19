export interface ParsedAddress {
  /** Street address including number, street name, and any unit/suite/apt info */
  street: string;
  /** City name */
  city: string;
  /** 2-letter US state abbreviation (e.g. "AZ", "CA") */
  state: string;
  /** 5-digit ZIP code */
  zip: string;
}

/**
 * Parse a US address string into its components.
 *
 * Handles a wide variety of real-world formats including:
 * - With or without commas
 * - Apartments, suites, buildings, lots, units
 * - Multi-word city names (e.g. "Sun City West", "San Tan Valley")
 * - Partial addresses (street only, or city/state/zip only)
 * - Trailing "USA" or "United States"
 * - Mixed case and ALL CAPS
 *
 * @example
 * parseAddress("14620 W Encanto Blvd STE 110 Goodyear AZ 85395")
 * // → { street: "14620 W Encanto Blvd STE 110", city: "Goodyear", state: "AZ", zip: "85395" }
 *
 * @example
 * parseAddress("1316 W University Dr, Mesa, AZ 85201, USA")
 * // → { street: "1316 W University Dr", city: "Mesa", state: "AZ", zip: "85201" }
 *
 * @example
 * parseAddress("77 E. Columbus Ave")
 * // → { street: "77 E. Columbus Ave", city: "", state: "", zip: "" }
 */
export declare function parseAddress(address: string): ParsedAddress;

export default parseAddress;
