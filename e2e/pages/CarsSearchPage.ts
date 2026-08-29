import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';


/**
 * Cars Search Page Object
 */
export class CarsSearchPage extends BasePage {


  // ============ LOCATORS ============

  /** Search input */
  get searchInput(): Locator {
    // The page search is a textbox, not combobox (header search is combobox)
    return this.page.getByRole('textbox', { name: /search cars/i });
  }

  /** Filter panel (desktop sidebar) */
  get filtersPanel(): Locator {
    return this.page.locator('aside');
  }

  /** Mobile filter drawer (opened via button) - the drawer panel inside the overlay */
  get mobileFiltersDrawer(): Locator {

    // The mobile drawer has shadow-xl and overflow-y-auto classes, inside a fixed overlay
    return this.page.locator('.fixed.inset-0 .shadow-xl.overflow-y-auto');
  }

  /** Get active filters container - finds the VISIBLE container with filter elements */
  async getActiveFiltersContainer(): Promise<Locator> {

    // Check if mobile drawer is visible first
    const mobileDrawer = this.mobileFiltersDrawer;
    const isMobileDrawerVisible = await mobileDrawer.isVisible().catch(() => false);
    
    if (isMobileDrawerVisible)
      return mobileDrawer;

    // Fall back to desktop sidebar
    return this.filtersPanel;
  }

  /** Mobile filters button */
  get mobileFiltersButton(): Locator {
    return this.page.getByRole('button', { name: /filters|filtry/i });
  }

  /** Results grid */
  get resultsGrid(): Locator {
    return this.page.locator('main').locator('[data-testid="cars-grid"], .grid').first();
  }

  /** Car cards */
  get carCards(): Locator {
    return this.page.locator('main h3').locator('xpath=ancestor::div[contains(@class, "rounded")]');
  }

  /** Pagination */
  get pagination(): Locator {
    return this.page.locator('main').locator('div').filter({
      has: this.page.locator('button[aria-label="Previous page"]')
    }).first();
  }

  /** Sort select */
  get sortSelect(): Locator {
    return this.page.locator('select').filter({ 
      has: this.page.locator('option', { hasText: /A-Z|Z-A|High to Low|Low to High|Domyślnie/i })
    }).first();
  }

  /** Page size select */
  get pageSizeSelect(): Locator {
    return this.page.locator('select').filter({ 
      has: this.page.locator('option', { hasText: /12|24|48/ })
    }).first();
  }

  /** No results message */
  get noResultsMessage(): Locator {
    return this.page.getByText(/no results|brak wyników|no cars found/i);
  }

  /** Loading state */
  get loading(): Locator {
    return this.page.locator('[data-testid="loading"], .animate-pulse, .skeleton');
  }

  /** Reset filters button */
  get resetFiltersButton(): Locator {
    return this.page.getByRole('button', { name: /reset|wyczyść|clear/i });
  }

  /** Results count */
  get resultsCount(): Locator {
    return this.page.locator('[data-testid="results-count"]').or(
      this.page.getByText(/found|znaleziono|results|wyników/i)
    );
  }


  // ============ FILTER LOCATORS ============

  /** Brand filter */
  getBrandFilter(): Locator {
    return this.filtersPanel.locator('[data-testid="brand-filter"], select, [role="combobox"]').first();
  }

  /** Model filter */
  getModelFilter(): Locator {
    return this.filtersPanel.locator('[data-testid="model-filter"]');
  }

  /** Body type filter checkboxes */
  getBodyTypeCheckboxes(): Locator {
    return this.filtersPanel.locator('input[type="checkbox"]');
  }

  /** Engine type filter */
  getEngineTypeFilter(): Locator {
    return this.filtersPanel.locator('[data-testid="engine-type-filter"]');
  }

  /** Min power input */
  getMinPowerInput(): Locator {
    return this.filtersPanel.locator('input[name*="minPower"], input[placeholder*="min"]').first();
  }

  /** Max power input */
  getMaxPowerInput(): Locator {
    return this.filtersPanel.locator('input[name*="maxPower"], input[placeholder*="max"]').first();
  }


  // ============ ACTIONS ============

  async goto(): Promise<void> {
    await this.page.goto('/cars');
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.page.waitForTimeout(500);
  }

  async selectSort(value: string): Promise<void> {
    await this.sortSelect.scrollIntoViewIfNeeded();
    await this.sortSelect.selectOption(value);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(300);
  }

  async selectPageSize(size: number): Promise<void> {
    await this.pageSizeSelect.scrollIntoViewIfNeeded();
    await this.pageSizeSelect.selectOption(size.toString());
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(300);
  }

  async goToPage(pageNumber: number): Promise<void> {
    const pageButton = this.page.locator('main button').filter({ hasText: new RegExp(`^${pageNumber}$`) });
    await pageButton.first().click();
  }

  async goToNextPage(): Promise<void> {
    const nextButton = this.page.locator('button[aria-label="Next page"]');
    await nextButton.scrollIntoViewIfNeeded();
    await nextButton.click({ force: true });
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(300);
  }

  async goToPreviousPage(): Promise<void> {
    const prevButton = this.page.locator('button[aria-label="Previous page"]');
    await prevButton.scrollIntoViewIfNeeded();
    await prevButton.click({ force: true });
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(300);
  }

  async clickCarCard(index: number = 0): Promise<void> {
    await this.waitForCarCards();
    const detailsLinks = this.page.locator('main').getByRole('link', { name: /details|szczegóły|card\.details/i });
    const link = detailsLinks.nth(index);
    await link.waitFor({ state: 'visible', timeout: 10000 });
    
    const href = await link.getAttribute('href');
    if (href) {
      await this.page.goto(href);
    } else {
      await link.click();
      await this.page.waitForURL(/\/cars\/[0-9a-fA-F-]{36}/, { timeout: 15000 });
    }
  }

  async resetFilters(): Promise<void> {

    // Ensure mobile drawer is open if on mobile, get the active container
    const container = await this.ensureMobileDrawerOpenAndGetContainer();
    
    // Find reset button within the active container
    const resetBtn = container.getByRole('button', { name: /reset|wyczyść|clear/i });
    await resetBtn.waitFor({ state: 'visible', timeout: 5000 });
    await resetBtn.scrollIntoViewIfNeeded();
    
    // Get current URL to detect change
    const currentUrl = this.page.url();
    
    await resetBtn.click();
    
    // Wait for URL to change (filters cleared)
    if (currentUrl.includes('brandIds') || currentUrl.includes('bodyTypeIds') || currentUrl.includes('engineTypeIds')) {
      await this.page.waitForFunction(
        (patterns) => !patterns.some(p => window.location.href.includes(p)),
        ['brandIds=', 'bodyTypeIds=', 'engineTypeIds='],
        { timeout: 10000 }
      );
    }
    
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(300);
  }

  async openMobileFilters(): Promise<void> {
    await this.mobileFiltersButton.click();

    // Wait for drawer to open
    await this.mobileFiltersDrawer.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(300);
  }

  /** Open filters panel - handles mobile drawer automatically */
  async openFiltersIfMobile(isMobile: boolean): Promise<void> {
    if (isMobile) {
      const isFilterButtonVisible = await this.mobileFiltersButton.isVisible();
      if (isFilterButtonVisible) {
        await this.mobileFiltersButton.click();

        // Wait for drawer to be visible
        await this.mobileFiltersDrawer.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.waitForTimeout(300);
      }
    }
  }


  // ============ FILTER ACTIONS ============

  /** Helper to ensure mobile filter drawer is open if on mobile, returns the active container */
  private async ensureMobileDrawerOpenAndGetContainer(): Promise<Locator> {

    // First, check if mobile drawer is already visible
    const drawer = this.mobileFiltersDrawer;
    const isDrawerAlreadyVisible = await drawer.isVisible().catch(() => false);
    if (isDrawerAlreadyVisible) {
      return drawer;
    }
    
    // Use viewport width as the authoritative source for mobile vs desktop
    const viewport = this.page.viewportSize();
    const isMobileViewport = viewport && viewport.width < 768;
    
    if (isMobileViewport) {

      // We're on mobile - need to open drawer
      const mobileFilterBtn = this.mobileFiltersButton;
      const isBtnVisible = await mobileFilterBtn.isVisible().catch(() => false);
      if (isBtnVisible) {
        await mobileFilterBtn.click();
        await drawer.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.waitForTimeout(300);
        return drawer;
      }
    }
    
    // Desktop - return sidebar
    return this.filtersPanel;
  }

  async selectBrand(brandName: string): Promise<void> {
    const container = await this.ensureMobileDrawerOpenAndGetContainer();
    const brandSelect = container.locator('select').first();
    await brandSelect.waitFor({ state: 'visible', timeout: 5000 });
    await brandSelect.selectOption({ label: brandName });
  }

  async selectBodyType(bodyType: string): Promise<void> {
    const container = await this.ensureMobileDrawerOpenAndGetContainer();
    const label = container.locator('label').filter({ hasText: new RegExp(bodyType, 'i') });
    await label.waitFor({ state: 'visible', timeout: 5000 });
    await label.click();
  }

  async selectEngineType(engineType: string): Promise<void> {
    const container = await this.ensureMobileDrawerOpenAndGetContainer();
    const label = container.locator('label').filter({ hasText: new RegExp(engineType, 'i') });
    await label.waitFor({ state: 'visible', timeout: 5000 });
    await label.click();
  }

  async expandPowerRangeSection(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    
    const container = await this.ensureMobileDrawerOpenAndGetContainer();
    const powerButton = container.locator('button').filter({ hasText: /power|moc/i }).first();
    const numberInputs = container.locator('input[type="number"]');
    
    // Retry logic for expanding the power section
    for (let attempt = 0; attempt < 3; attempt++) {
      const inputsVisible = await numberInputs.first().isVisible().catch(() => false);
      if (inputsVisible) break;
      
      // Scroll the power section into view within the container
      await powerButton.waitFor({ state: 'attached', timeout: 5000 });
      await powerButton.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
      await this.page.waitForTimeout(200);
      
      await powerButton.waitFor({ state: 'visible', timeout: 10000 });
      await powerButton.click();
      
      // Wait for expansion animation
      await this.page.waitForTimeout(500);
      
      // Check if inputs appeared
      const appeared = await numberInputs.first().isVisible().catch(() => false);
      if (appeared) break;
      
      // If not, wait a bit more before retry
      await this.page.waitForTimeout(300);
    }
    
    // Final wait for inputs to be visible
    await numberInputs.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async setMinPower(value: number): Promise<void> {
    await this.expandPowerRangeSection();
    const container = await this.ensureMobileDrawerOpenAndGetContainer();
    const inputs = container.locator('input[type="number"]');
    await inputs.first().fill(value.toString());
    await inputs.first().blur();
    await this.page.waitForTimeout(500);
  }

  async setMaxPower(value: number): Promise<void> {
    await this.expandPowerRangeSection();
    const container = await this.ensureMobileDrawerOpenAndGetContainer();
    const inputs = container.locator('input[type="number"]');
    await inputs.nth(1).fill(value.toString());
    await inputs.nth(1).blur();
    await this.page.waitForTimeout(500);
  }


  // ============ ASSERTIONS ============

  async expectPageVisible(): Promise<void> {
    await expect(this.searchInput).toBeVisible();
    await expect(this.resultsGrid).toBeVisible();
  }

  async waitForCarCards(timeout: number = 15000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
    await this.page.locator('.animate-pulse, .skeleton').first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await this.page.getByText(/^Loading\.\.\.$/i).waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await this.carCards.first().waitFor({ state: 'visible', timeout });
  }

  async expectResultsCount(count: number): Promise<void> {
    await expect(this.carCards).toHaveCount(count);
  }

  async expectResultsCountGreaterThan(count: number): Promise<void> {
    await this.waitForCarCards();
    const cards = await this.carCards.count();
    expect(cards).toBeGreaterThan(count);
  }

  async expectNoResults(): Promise<void> {
    await expect(this.noResultsMessage).toBeVisible();
  }

  async expectLoading(): Promise<void> {
    await expect(this.loading.first()).toBeVisible();
  }

  async expectNotLoading(): Promise<void> {
    await expect(this.loading).not.toBeVisible();
  }

  async expectUrlContains(params: Record<string, string>): Promise<void> {
    for (const [key, value] of Object.entries(params)) {
      await expect(this.page).toHaveURL(new RegExp(`${key}=${value}`));
    }
  }

  async expectCarCardWithName(name: string): Promise<void> {
    await expect(this.carCards.filter({ hasText: name }).first()).toBeVisible();
  }

  async expectPaginationVisible(): Promise<void> {
    await expect(this.pagination).toBeVisible();
  }

  async expectCurrentPage(page: number): Promise<void> {
    const activeButton = this.page.locator('main button.bg-primary-600');
    await expect(activeButton).toContainText(page.toString());
  }
}
