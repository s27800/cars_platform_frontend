
/**
 * Format date to "DD MMM YYYY" format
 */
export const formatDate = (dateString) => {
  if (!dateString)
    return '';
  
  const date = new Date(dateString);

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Calculate average consumption
 */
export const calculateAverage = (values) => {
  const validValues = values.filter(v => v !== null && v !== undefined);

  if (validValues.length === 0)
    return 0;
  
  return validValues.reduce((sum, v) => sum + v, 0) / validValues.length;
};

/**
 * Get fuel consumption level colour based on consumption value
 */
export const getConsumptionLevel = (value) => {
  const numValue = parseFloat(value);
  if (numValue <= 5)
    return { label: 'Very economical', color: 'text-green-600 dark:text-green-400' };
  
  if (numValue <= 7)
    return { label: 'Economical', color: 'text-green-500 dark:text-green-400' };
  
  if (numValue <= 10)
    return { label: 'Average', color: 'text-yellow-600 dark:text-yellow-400' };
  
  if (numValue <= 13)
    return { label: 'Above average', color: 'text-orange-500 dark:text-orange-400' };
  
  return { label: 'High consumption', color: 'text-red-500 dark:text-red-400' };
};

/**
 * Get car display name based on available properties
 */
export const getCarDisplayName = (car) => {
  if (!car)
    return '';

  if (car.name)
    return car.name;

  return `${car.brand?.name || ''} ${car.model?.name || ''} ${car.generation?.name || ''}`.trim() || 'Unknown Car';
};

/**
 * Parse JSON from localStorage
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
 * Save item JSON to localStorage
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};
