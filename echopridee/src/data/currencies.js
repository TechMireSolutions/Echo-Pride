export const currencies = [
  {
    code: 'USD',
    name: 'United States',
    country: 'US',
    flag: '🇺🇸',
    symbol: '$',
    rate: 1,
  },
  {
    code: 'GBP',
    name: 'United Kingdom',
    country: 'GB',
    flag: '🇬🇧',
    symbol: '£',
    rate: 0.7842,
  },
  {
    code: 'EUR',
    name: 'Eurozone',
    country: 'EU',
    flag: '🇪🇺',
    symbol: '€',
    rate: 0.921,
  },
  {
    code: 'PKR',
    name: 'Pakistan',
    country: 'PK',
    flag: '🇵🇰',
    symbol: '₨',
    rate: 278.45,
  },
  {
    code: 'AED',
    name: 'United Arab Emirates',
    country: 'AE',
    flag: '🇦🇪',
    symbol: 'د.إ',
    rate: 3.6725,
  },
  {
    code: 'SAR',
    name: 'Saudi Arabia',
    country: 'SA',
    flag: '🇸🇦',
    symbol: '﷼',
    rate: 3.75,
  },
  {
    code: 'CAD',
    name: 'Canada',
    country: 'CA',
    flag: '🇨🇦',
    symbol: 'CA$',
    rate: 1.368,
  },
  {
    code: 'AUD',
    name: 'Australia',
    country: 'AU',
    flag: '🇦🇺',
    symbol: 'A$',
    rate: 1.5245,
  },
]

export const getCurrency = (code) => currencies.find((c) => c.code === code) || currencies[0]

export const parseUsdPrice = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const num = parseFloat(String(value ?? '').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(num) ? num : 0
}
