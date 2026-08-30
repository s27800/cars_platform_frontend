
// Rating categories for reviews
export const RATING_CATEGORIES = [
  { key: 'engineRating', labelKey: 'engine', descKey: 'engineDesc' },
  { key: 'transmissionRating', labelKey: 'transmission', descKey: 'transmissionDesc' },
  { key: 'steeringRating', labelKey: 'steering', descKey: 'steeringDesc' },
  { key: 'suspensionRating', labelKey: 'suspension', descKey: 'suspensionDesc' },
  { key: 'visibilityRating', labelKey: 'visibility', descKey: 'visibilityDesc' },
  { key: 'ergonomicsRating', labelKey: 'ergonomics', descKey: 'ergonomicsDesc' },
  { key: 'soundProofingRating', labelKey: 'soundProofing', descKey: 'soundProofingDesc' },
  { key: 'interiorSpaceRating', labelKey: 'interiorSpace', descKey: 'interiorSpaceDesc' },
  { key: 'maintenanceRating', labelKey: 'maintenance', descKey: 'maintenanceDesc' },
  { key: 'priceQualityRating', labelKey: 'priceQuality', descKey: 'priceQualityDesc' },
  { key: 'failureFreeRating', labelKey: 'reliability', descKey: 'reliabilityDesc' },
];

// Data proposal categories
export const PROPOSAL_CATEGORIES = [
  { value: 'ENGINE', label: 'Engine' },
  { value: 'TRANSMISSION', label: 'Transmission' },
  { value: 'CHASSIS', label: 'Chassis & Brakes' },
  { value: 'PERFORMANCE', label: 'Performance' },
  { value: 'OUTSIDE_DIMENSIONS', label: 'Outside Dimensions' },
  { value: 'INSIDE_DIMENSIONS', label: 'Inside Dimensions' },
  { value: 'BASIC_INFO', label: 'Basic Information' },
  { value: 'TAGS', label: 'Tags' },
];

// Pagination default values
export const DEFAULT_PAGE_SIZE = 10;
export const REVIEWS_PAGE_SIZE = 5;
export const FUEL_REPORTS_PAGE_SIZE = 5;

// Comparison limit
export const MAX_COMPARISON_CARS = 4;

// LocalStorage keys
export const STORAGE_KEYS = {
  COMPARISON_CARS: 'comparisonCars',
  THEME: 'theme',
};
