/**
 * Utility functions for geolocation and country-based pricing
 */

// Cache for country data to avoid repeated API calls
let cachedCountry = null
let cacheExpiry = null
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Get user's country using IP geolocation
 * @returns {Promise<string>} Country code (e.g., 'US', 'IN', 'GB')
 */
export const getUserCountry = async () => {
  // Check cache first
  if (cachedCountry && cacheExpiry && Date.now() < cacheExpiry) {
    return cachedCountry
  }

  try {
    // Try multiple geolocation services for reliability
    const country = await Promise.any([
      fetchCountryFromIpApi(),
      fetchCountryFromIpInfo(),
      fetchCountryFromIpApiCo()
    ])

    // Cache the result
    cachedCountry = country
    cacheExpiry = Date.now() + CACHE_DURATION

    return country
  } catch (error) {
    console.warn('Failed to detect country:', error)
    // Return default country (US) if all services fail
    return 'US'
  }
}

/**
 * Fetch country from ipapi.co
 */
const fetchCountryFromIpApi = async () => {
  const response = await fetch('https://ipapi.co/json/', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error('ipapi.co request failed')
  }
  
  const data = await response.json()
  return data.country_code
}

/**
 * Fetch country from ipinfo.io
 */
const fetchCountryFromIpInfo = async () => {
  const response = await fetch('https://ipinfo.io/json', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error('ipinfo.io request failed')
  }
  
  const data = await response.json()
  return data.country
}

/**
 * Fetch country from ip-api.com
 */
const fetchCountryFromIpApiCo = async () => {
  const response = await fetch('http://ip-api.com/json/?fields=countryCode', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error('ip-api.com request failed')
  }
  
  const data = await response.json()
  return data.countryCode
}

/**
 * Get currency symbol for a country
 * @param {string} countryCode - Country code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (countryCode) => {
  const currencyMap = {
    'US': '$',
    'CA': 'C$',
    'GB': '£',
    'EU': '€',
    'IN': '₹',
    'AU': 'A$',
    'JP': '¥',
    'KR': '₩',
    'CN': '¥',
    'BR': 'R$',
    'MX': '$',
    'RU': '₽',
    'ZA': 'R',
    'NG': '₦',
    'KE': 'KSh',
    'EG': 'E£',
    'SA': 'SAR',
    'AE': 'AED',
    'TR': '₺',
    'TH': '฿',
    'SG': 'S$',
    'MY': 'RM',
    'ID': 'Rp',
    'PH': '₱',
    'VN': '₫'
  }
  
  return currencyMap[countryCode] || '$'
}

/**
 * Get pricing region for a country
 * @param {string} countryCode - Country code
 * @returns {string} Pricing region
 */
export const getPricingRegion = (countryCode) => {
  // Define pricing regions based on economic factors
  const regions = {
    // Tier 1 - High income countries
    'US': 'tier1',
    'CA': 'tier1',
    'GB': 'tier1',
    'AU': 'tier1',
    'DE': 'tier1',
    'FR': 'tier1',
    'JP': 'tier1',
    'SG': 'tier1',
    'NL': 'tier1',
    'SE': 'tier1',
    'NO': 'tier1',
    'DK': 'tier1',
    'CH': 'tier1',
    'NZ': 'tier1',
    
    // Tier 2 - Upper middle income countries
    'BR': 'tier2',
    'MX': 'tier2',
    'TR': 'tier2',
    'RU': 'tier2',
    'CN': 'tier2',
    'TH': 'tier2',
    'MY': 'tier2',
    'ID': 'tier2',
    'PH': 'tier2',
    'VN': 'tier2',
    'EG': 'tier2',
    'SA': 'tier2',
    'AE': 'tier2',
    'ZA': 'tier2',
    
    // Tier 3 - Lower middle income countries
    'IN': 'tier3',
    'NG': 'tier3',
    'KE': 'tier3',
    'PK': 'tier3',
    'BD': 'tier3',
    'LK': 'tier3',
    'NP': 'tier3',
    'MM': 'tier3',
    'KH': 'tier3',
    'LA': 'tier3',
    'MN': 'tier3',
    'UZ': 'tier3',
    'KZ': 'tier3',
    'KG': 'tier3',
    
    // Tier 4 - Low income countries
    'AF': 'tier4',
    'ET': 'tier4',
    'TD': 'tier4',
    'ML': 'tier4',
    'BF': 'tier4',
    'NE': 'tier4',
    'MW': 'tier4',
    'MZ': 'tier4',
    'MG': 'tier4',
    'BI': 'tier4',
    'RW': 'tier4',
    'SS': 'tier4',
    'CF': 'tier4',
    'CD': 'tier4'
  }
  
  return regions[countryCode] || 'tier1'
}

/**
 * Get pricing multiplier for a region
 * @param {string} region - Pricing region
 * @returns {number} Pricing multiplier
 */
export const getPricingMultiplier = (region) => {
  const multipliers = {
    'tier1': 1.0,    // Full price
    'tier2': 0.7,    // 30% discount
    'tier3': 0.5,    // 50% discount
    'tier4': 0.3     // 70% discount
  }
  
  return multipliers[region] || 1.0
}

/**
 * Format price with currency symbol
 * @param {number} price - Price in base currency
 * @param {string} countryCode - Country code
 * @param {number} multiplier - Pricing multiplier
 * @returns {string} Formatted price
 */
export const formatPrice = (price, countryCode, multiplier = 1) => {
  const currencySymbol = getCurrencySymbol(countryCode)
  const adjustedPrice = price * multiplier
  
  // Format based on currency
  if (currencySymbol === '₹') {
    // Indian Rupees - no decimal places
    return `${currencySymbol}${Math.round(adjustedPrice)}`
  } else if (currencySymbol === '¥' || currencySymbol === '₩') {
    // Japanese Yen, Korean Won - no decimal places
    return `${currencySymbol}${Math.round(adjustedPrice)}`
  } else {
    // Other currencies - 2 decimal places
    return `${currencySymbol}${adjustedPrice.toFixed(2)}`
  }
}

/**
 * Clear cached country data
 */
export const clearCountryCache = () => {
  cachedCountry = null
  cacheExpiry = null
} 