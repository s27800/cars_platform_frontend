const DATE_LOCALES = {
  en: 'en-GB',
  pl: 'pl-PL',
};

/**
 * Format an ISO date for display, in whichever language the UI is currently in.
 *
 * @param {string} dateString - ISO date coming from the API
 * @returns {string} - empty for no date
 */
export const formatDate = (dateString) => {
  if (!dateString)
    return '';

  const language = document.documentElement.lang;
  const date = new Date(dateString);

  return date.toLocaleDateString(DATE_LOCALES[language] || DATE_LOCALES.en, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Arithmetic mean of the values that are actually present.
 *
 * @param {Array<number|null>} values - ratings or measurements
 * @returns {number} - 0 when there is nothing to average
 */
export const calculateAverage = (values) => {
  const validValues = values.filter(v => v !== null && v !== undefined);

  if (validValues.length === 0)
    return 0;

  return validValues.reduce((sum, v) => sum + v, 0) / validValues.length;
};

/**
 * Bucket a fuel consumption figure so it can be shown with a colour and a word.
 *
 * @param {number|string} value - consumption in l/100 km
 * @returns {{labelKey: string, color: string, variant: string}}
 */
export const getConsumptionLevel = (value) => {
  const numValue = parseFloat(value);

  if (numValue <= 5)
    return { labelKey: 'veryEconomical', color: 'text-green-600 dark:text-green-400', variant: 'success' };

  if (numValue <= 7)
    return { labelKey: 'economical', color: 'text-green-500 dark:text-green-400', variant: 'success' };

  if (numValue <= 10)
    return { labelKey: 'average', color: 'text-yellow-600 dark:text-yellow-400', variant: 'warning' };

  if (numValue <= 13)
    return { labelKey: 'aboveAverage', color: 'text-orange-500 dark:text-orange-400', variant: 'warning' };

  return { labelKey: 'high', color: 'text-red-500 dark:text-red-400', variant: 'danger' };
};

/**
 * Build the name shown for a car if name is missing.
 *
 * @param {object} car - car as returned by the API
 * @returns {string} - empty when nothing is known
 */
export const getCarDisplayName = (car) => {
  if (!car)
    return '';

  if (car.name)
    return car.name;

  return `${car.brand?.name || ''} ${car.model?.name || ''} ${car.generation?.name || ''}`.trim();
};

/**
 * Read a JSON value from localStorage.
 *
 * @param {string} key - one of STORAGE_KEYS
 * @param {*} defaultValue - returned when the entry is missing or unreadable
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);

    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * Store a value as JSON.
 *
 * @param {string} key - one of STORAGE_KEYS
 * @param {*} value - any JSON-serialisable value
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage is unavailable or full
  }
};
