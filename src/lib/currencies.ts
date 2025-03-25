import { getName } from 'country-list';
import getSymbolFromCurrency from 'currency-symbol-map';

// Extended list of currencies with their country codes
const currencyList = [
  { code: 'USD', countryCode: 'US' },
  { code: 'EUR', countryCode: 'EU' },
  { code: 'GBP', countryCode: 'GB' },
  { code: 'JPY', countryCode: 'JP' },
  { code: 'AUD', countryCode: 'AU' },
  { code: 'CAD', countryCode: 'CA' },
  { code: 'CHF', countryCode: 'CH' },
  { code: 'CNY', countryCode: 'CN' },
  { code: 'INR', countryCode: 'IN' },
  { code: 'NZD', countryCode: 'NZ' },
  { code: 'SGD', countryCode: 'SG' },
  { code: 'HKD', countryCode: 'HK' },
  { code: 'KRW', countryCode: 'KR' },
  { code: 'MXN', countryCode: 'MX' },
  { code: 'BRL', countryCode: 'BR' },
  { code: 'AED', countryCode: 'AE' },
  { code: 'AFN', countryCode: 'AF' },
  { code: 'ALL', countryCode: 'AL' },
  { code: 'AMD', countryCode: 'AM' },
  { code: 'ARS', countryCode: 'AR' },
  { code: 'BAM', countryCode: 'BA' },
  { code: 'BGN', countryCode: 'BG' },
  { code: 'BHD', countryCode: 'BH' },
  { code: 'BIF', countryCode: 'BI' },
  { code: 'BOB', countryCode: 'BO' },
  { code: 'CLP', countryCode: 'CL' },
  { code: 'COP', countryCode: 'CO' },
  { code: 'CRC', countryCode: 'CR' },
  { code: 'CZK', countryCode: 'CZ' },
  { code: 'DKK', countryCode: 'DK' },
  { code: 'DZD', countryCode: 'DZ' },
  { code: 'EGP', countryCode: 'EG' },
  { code: 'ETB', countryCode: 'ET' },
  { code: 'GEL', countryCode: 'GE' },
  { code: 'GHS', countryCode: 'GH' },
  { code: 'HRK', countryCode: 'HR' },
  { code: 'HUF', countryCode: 'HU' },
  { code: 'IDR', countryCode: 'ID' },
  { code: 'ILS', countryCode: 'IL' },
  { code: 'ISK', countryCode: 'IS' },
  { code: 'JOD', countryCode: 'JO' },
  { code: 'KES', countryCode: 'KE' },
  { code: 'KWD', countryCode: 'KW' },
  { code: 'LBP', countryCode: 'LB' },
  { code: 'MAD', countryCode: 'MA' },
  { code: 'MYR', countryCode: 'MY' },
  { code: 'NGN', countryCode: 'NG' },
  { code: 'NOK', countryCode: 'NO' },
  { code: 'NPR', countryCode: 'NP' },
  { code: 'OMR', countryCode: 'OM' },
  { code: 'PEN', countryCode: 'PE' },
  { code: 'PHP', countryCode: 'PH' },
  { code: 'PKR', countryCode: 'PK' },
  { code: 'PLN', countryCode: 'PL' },
  { code: 'QAR', countryCode: 'QA' },
  { code: 'RON', countryCode: 'RO' },
  { code: 'RSD', countryCode: 'RS' },
  { code: 'RUB', countryCode: 'RU' },
  { code: 'SAR', countryCode: 'SA' },
  { code: 'SEK', countryCode: 'SE' },
  { code: 'THB', countryCode: 'TH' },
  { code: 'TND', countryCode: 'TN' },
  { code: 'TRY', countryCode: 'TR' },
  { code: 'TWD', countryCode: 'TW' },
  { code: 'UAH', countryCode: 'UA' },
  { code: 'UGX', countryCode: 'UG' },
  { code: 'UYU', countryCode: 'UY' },
  { code: 'VND', countryCode: 'VN' },
  { code: 'ZAR', countryCode: 'ZA' },
];

// Format currencies with symbols and country names
export const currencies = currencyList.map(currency => ({
  name: getName(currency.countryCode) || currency.code,
  code: currency.code,
  symbol: getSymbolFromCurrency(currency.code) || currency.code,
})).sort((a, b) => a.name.localeCompare(b.name));

// Export helper functions
export const getCurrencySymbol = (code: string): string => {
  return getSymbolFromCurrency(code) || code;
};

export const getCurrencyByCode = (code: string) => {
  return currencies.find(c => c.code === code);
};

export const getCurrencyBySymbol = (symbol: string) => {
  return currencies.find(c => c.symbol === symbol);
};