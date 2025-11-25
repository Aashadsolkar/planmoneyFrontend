// dateUtils.js

/**
 * Convert any date string to DD-MM-YYYY format.
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} - Formatted date in DD-MM-YYYY format
 */
export function formatDateToDDMMYYYY(dateString) {
  if (!dateString) return ""; // Handle null/undefined

  const date = new Date(dateString);
  if (isNaN(date)) return ""; // Invalid date check

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function formatIndianNumber(amount) {
  if (amount == null) return "0.00";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}