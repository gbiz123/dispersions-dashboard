/**
 * Format a number with commas as thousands separators
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

/**
 * Format a number with a specified number of decimal places
 */
export const formatDecimal = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

/**
 * Format a date string to a more readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

/**
 * Convert units between systems (e.g., metric to imperial)
 */
export const convertUnits = {
  metersToFeet: (meters: number): number => meters * 3.28084,
  feetToMeters: (feet: number): number => feet / 3.28084,
  celsiusToFahrenheit: (celsius: number): number => (celsius * 9/5) + 32,
  fahrenheitToCelsius: (fahrenheit: number): number => (fahrenheit - 32) * 5/9,
  kelvinToCelsius: (kelvin: number): number => kelvin - 273.15,
  celsiusToKelvin: (celsius: number): number => celsius + 273.15
};

export default {
  formatNumber,
  formatDecimal,
  formatDate,
  convertUnits
};