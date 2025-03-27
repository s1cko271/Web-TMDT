/**
 * Utility functions for currency conversion and formatting
 */

// Exchange rate from VND to USD (approximately 24,000 VND per USD)
const VND_TO_USD_RATE = 1 / 24000;

/**
 * Convert VND to USD
 * @param {number} vndAmount - Amount in VND
 * @returns {number} - Amount in USD
 */
export const convertVndToUsd = (vndAmount) => {
  return vndAmount * VND_TO_USD_RATE;
};

/**
 * Format currency based on locale
 * @param {number} amount - Amount to format (in VND)
 * @param {string} locale - Locale code ('en' or 'vi')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, locale) => {
  if (locale === 'vi') {
    // Format as VND with thousands separator
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0, // VND doesn't use decimal places
    }).format(amount);
  } else {
    // Convert to USD and format for English locale
    const usdAmount = convertVndToUsd(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usdAmount);
  }
};