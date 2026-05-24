export const parsePrice    = str => parseFloat(String(str).replace(/[^0-9.]/g, ''));
export const isValidPrice  = price => typeof price === 'number' && !Number.isNaN(price) && price > 0;
export const formatPrice   = price => `£${Number(price).toFixed(2)}`;
export const comparePrices = (a, b) => a - b;
