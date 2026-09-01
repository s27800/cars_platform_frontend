
/**
 * Test selectors
 */
export const SELECTORS = {
  
  // Auth
  LOGIN_FORM: 'login-form',
  LOGIN_USERNAME: 'login-username',
  LOGIN_PASSWORD: 'login-password',
  LOGIN_SUBMIT: 'login-submit',
  LOGIN_ERROR: 'login-error',
  REGISTER_FORM: 'register-form',
  
  // Header
  HEADER: 'header',
  LOGO: 'logo',
  NAV_CARS: 'nav-cars',
  NAV_COMPARISON: 'nav-comparison',
  NAV_LOGIN: 'nav-login',
  NAV_REGISTER: 'nav-register',
  USER_MENU: 'user-menu',
  THEME_TOGGLE: 'theme-toggle',
  LANGUAGE_TOGGLE: 'language-toggle',

  // Cars Search
  CARS_SEARCH_INPUT: 'cars-search-input',
  CARS_GRID: 'cars-grid',
  CAR_CARD: 'car-card',
  FILTERS_PANEL: 'filters-panel',
  FILTER_BRAND: 'filter-brand',
  FILTER_MODEL: 'filter-model',
  FILTER_BODY_TYPE: 'filter-body-type',
  FILTER_ENGINE_TYPE: 'filter-engine-type',
  FILTER_MIN_POWER: 'filter-min-power',
  FILTER_MAX_POWER: 'filter-max-power',
  RESET_FILTERS: 'reset-filters',
  PAGINATION: 'pagination',
  SORT_SELECT: 'sort-select',
  PAGE_SIZE_SELECT: 'page-size-select',
  RESULTS_COUNT: 'results-count',

  // Car Details
  CAR_TITLE: 'car-title',
  IMAGE_GALLERY: 'image-gallery',
  GALLERY_MAIN: 'gallery-main-image',
  GALLERY_THUMBNAILS: 'gallery-thumbnails',
  GALLERY_NEXT: 'gallery-next',
  GALLERY_PREV: 'gallery-prev',
  SPECIFICATIONS: 'specifications',
  ENGINE_SPECS: 'engine-specs',
  ADD_TO_COMPARISON: 'add-to-comparison',
  LIKE_BUTTON: 'like-button',
  REVIEWS_SECTION: 'reviews-section',
  ADD_REVIEW_BUTTON: 'add-review-button',
  FUEL_REPORTS_SECTION: 'fuel-reports-section',
  ADD_FUEL_REPORT_BUTTON: 'add-fuel-report-button',
  BREADCRUMBS: 'breadcrumbs',

  // Comparison
  COMPARISON_TABLE: 'comparison-table',
  COMPARISON_CAR: 'comparison-car',
  COMPARISON_SELECTOR: 'comparison-selector',
  COMPARISON_SEARCH: 'comparison-search',
  REMOVE_CAR: 'remove-car',
  CLEAR_ALL: 'clear-all',

  // Profile
  PROFILE_INFO: 'profile-info',
  PROFILE_EDIT_FORM: 'profile-edit-form',
  PASSWORD_FORM: 'password-form',
  ACTIVITY_LIST: 'activity-list',
  ACTIVITY_ITEM: 'activity-item',

  // Admin
  ADMIN_DASHBOARD: 'admin-dashboard',
  STAT_CARD: 'stat-card',
  REVIEWS_LIST: 'reviews-list',
  REVIEW_ITEM: 'review-item',
  APPROVE_BUTTON: 'approve-button',
  REJECT_BUTTON: 'reject-button',
  FUEL_REPORTS_LIST: 'fuel-reports-list',
  PROPOSALS_LIST: 'proposals-list',

  // Common UI
  SPINNER: 'spinner',
  TOAST: 'toast',
  MODAL: 'modal',
  MODAL_CLOSE: 'modal-close',
  ALERT: 'alert',
  SKELETON: 'skeleton',
};


/**
 * Helper functions
 */

export function testId(id: string): string {
  return `[data-testid="${id}"]`;
}

export function ariaLabel(label: string): string {
  return `[aria-label="${label}"]`;
}
