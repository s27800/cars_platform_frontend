
// Rating categories for reviews
export const RATING_CATEGORIES = [
  { key: 'engineRating', label: 'Engine', description: 'Performance, sound, response' },
  { key: 'transmissionRating', label: 'Transmission', description: 'Smooth shifts, gear ratios' },
  { key: 'steeringRating', label: 'Steering', description: 'Feel, precision, feedback' },
  { key: 'suspensionRating', label: 'Suspension', description: 'Comfort, handling balance' },
  { key: 'visibilityRating', label: 'Visibility', description: 'Mirrors, blind spots, parking' },
  { key: 'ergonomicsRating', label: 'Ergonomics', description: 'Controls, seating position' },
  { key: 'soundProofingRating', label: 'Sound proofing', description: 'Road noise, wind noise' },
  { key: 'interiorSpaceRating', label: 'Interior space', description: 'Legroom, cargo, storage' },
  { key: 'maintenanceRating', label: 'Maintenance', description: 'Service costs, reliability' },
  { key: 'priceQualityRating', label: 'Price/Quality', description: 'Value for money' },
  { key: 'failureFreeRating', label: 'Reliability', description: 'Breakdown frequency, durability' },
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
