/**
 * Test data fixtures for E2E tests
 */

// ============ TEST USERS ============
export const TEST_USERS = {
  admin: {
    username: 'admin',
    password: 'Test123!',
    email: 'admin@carsplatform.com',
    firstName: 'Test',
    lastName: 'Admin',
    isAdmin: true,
  },
  moderator: {
    username: 'moderator',
    password: 'Test123!',
    email: 'moderator@carsplatform.com',
    firstName: 'Test',
    lastName: 'Moderator',
    isAdmin: true,
  },
  regularUser: {
    username: 'john_smith',
    password: 'Test123!',
    email: 'john.smith@carsplatform.com',
    firstName: 'John',
    lastName: 'Smith',
    isAdmin: false,
  },
  secondUser: {
    username: 'anna_jones',
    password: 'Test123!',
    email: 'anna.jones@carsplatform.com',
    firstName: 'Anna',
    lastName: 'Jones',
    isAdmin: false,
  },
  thirdUser: {
    username: 'peter_wilson',
    password: 'Test123!',
    email: 'peter.wilson@carsplatform.com',
    firstName: 'Peter',
    lastName: 'Wilson',
    isAdmin: false,
  },
};

// Generate unique user
export const generateNewUser = () => {
  const timestamp = Date.now();
  const shortId = String(timestamp).slice(-8);

  return {
    username: `user_${shortId}`,
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!',
    email: `testuser_${timestamp}@test.com`,
    firstName: 'Test',
    lastName: 'User',
  };
};

// ============ TEST BRANDS ============
export const TEST_BRANDS = {
  volkswagen: { id: 1, name: 'Volkswagen', country: 'Germany' },
  bmw: { id: 2, name: 'BMW', country: 'Germany' },
  audi: { id: 3, name: 'Audi', country: 'Germany' },
  mercedes: { id: 4, name: 'Mercedes-Benz', country: 'Germany' },
  toyota: { id: 5, name: 'Toyota', country: 'Japan' },
  honda: { id: 6, name: 'Honda', country: 'Japan' },
  mazda: { id: 7, name: 'Mazda', country: 'Japan' },
  ford: { id: 8, name: 'Ford', country: 'USA' },
  skoda: { id: 9, name: 'Skoda', country: 'Czech Republic' },
  hyundai: { id: 10, name: 'Hyundai', country: 'South Korea' },
};

// ============ TEST MODELS ============
export const TEST_MODELS = {

  // Volkswagen
  golf: { id: 1, brandId: 1, name: 'Golf' },
  passat: { id: 2, brandId: 1, name: 'Passat' },
  tiguan: { id: 3, brandId: 1, name: 'Tiguan' },

  // BMW
  series3: { id: 6, brandId: 2, name: 'Series 3' },
  series5: { id: 7, brandId: 2, name: 'Series 5' },
  x3: { id: 8, brandId: 2, name: 'X3' },

  // Audi
  a3: { id: 11, brandId: 3, name: 'A3' },
  a4: { id: 12, brandId: 3, name: 'A4' },
  a6: { id: 13, brandId: 3, name: 'A6' },
};

// ============ TEST CARS ============
export const TEST_CARS = {
  volkswagenGolf: { id: 1, name: 'Volkswagen Golf' },
  bmwSeries3: { id: 2, name: 'BMW 3 Series' },
  audiA4: { id: 3, name: 'Audi A4' },
};

// ============ FILTER OPTIONS ============
export const FILTER_OPTIONS = {
  bodyTypes: [
    { id: 1, name: 'Sedan' },
    { id: 2, name: 'Hatchback' },
    { id: 3, name: 'Wagon' },
    { id: 4, name: 'SUV' },
    { id: 5, name: 'Crossover' },
    { id: 6, name: 'Coupe' },
    { id: 7, name: 'Convertible' },
  ],
  engineTypes: ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'LPG'],
  transmissionTypes: ['MANUAL', 'AUTOMATIC'],
  driveTypes: ['FWD', 'RWD', 'AWD'],
  tags: [
    { id: 1, name: 'Sporty' },
    { id: 2, name: 'Family' },
    { id: 3, name: 'Economic' },
    { id: 4, name: 'Luxury' },
    { id: 5, name: 'Off-road' },
  ],
};

// ============ TEST REVIEW DATA ============
export const TEST_REVIEW = {
  valid: {
    comment: 'This is a test review comment with sufficient length for validation.',
    engineRating: 4,
    transmissionRating: 5,
    steeringRating: 4,
    suspensionRating: 3,
    visibilityRating: 4,
    ergonomicsRating: 5,
    soundProofingRating: 4,
    interiorSpaceRating: 4,
    maintenanceRating: 3,
    priceQualityRating: 4,
    failureFreeRating: 5,
  },
  invalid: {
    comment: 'Short', // Too short
    engineRating: 0, // Invalid rating
  },
};

// ============ TEST FUEL REPORT DATA ============
export const TEST_FUEL_REPORT = {
  valid: {
    cityConsumption: 8.5,
    highwayConsumption: 6.2,
    mixedConsumption: 7.3,
    comment: 'Normal driving conditions, mixed city and highway.',
  },
  invalid: {
    cityConsumption: -5, // Invalid negative value
    highwayConsumption: 100, // Invalid unrealistic value
  },
};

// ============ PAGINATION ============
export const PAGINATION = {
  defaultPageSize: 12,
  pageSizeOptions: [12, 24, 48],
};

// ============ SORT OPTIONS ============
export const SORT_OPTIONS = {
  default: '',
  nameAsc: 'name,asc',
  nameDesc: 'name,desc',
  powerAsc: 'engine.power,asc',
  powerDesc: 'engine.power,desc',
};

// ============ ROUTES ============
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  cars: '/cars',
  carDetails: (id: number) => `/cars/${id}`,
  brands: (id: number) => `/brands/${id}`,
  models: (id: number) => `/models/${id}`,
  generations: (id: number) => `/generations/${id}`,
  comparison: '/comparison',
  profile: '/profile',
  profilePassword: '/profile/password',
  profileReviews: '/profile/reviews',
  profileReports: '/profile/reports',
  profileProposals: '/profile/proposals',
  admin: '/admin',
  adminReviews: '/admin/reviews',
  adminFuelReports: '/admin/fuel-reports',
  adminProposals: '/admin/proposals',
  about: '/about',
  faq: '/faq',
  terms: '/terms',
  privacy: '/privacy',
};
