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

  /** Filter panel (desktop) */
  get filtersPanel(): Locator {
    return this.page.locator('[data-testid="filters-panel"], .filters-panel, aside');
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
      await this.page.waitForURL(/\/cars\/\d+/, { timeout: 15000 });
    }
  }

  async resetFilters(): Promise<void> {
    await this.resetFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(300);
  }

  async openMobileFilters(): Promise<void> {
    await this.mobileFiltersButton.click();
  }


  // ============ FILTER ACTIONS ============

  async selectBrand(brandName: string): Promise<void> {
    const brandSelect = this.filtersPanel.locator('select').first();
    await brandSelect.selectOption({ label: brandName });
  }

  async selectBodyType(bodyType: string): Promise<void> {
    const label = this.filtersPanel.locator('label').filter({ hasText: new RegExp(bodyType, 'i') });
    await label.click();
  }

  async selectEngineType(engineType: string): Promise<void> {
    const label = this.filtersPanel.locator('label').filter({ hasText: new RegExp(engineType, 'i') });
    await label.click();
  }

  async expandPowerRangeSection(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    
    const powerButton = this.filtersPanel.locator('button').filter({ hasText: /power|moc/i }).first();
    const numberInputs = this.filtersPanel.locator('input[type="number"]');
    
    const inputsVisible = await numberInputs.first().isVisible().catch(() => false);
    if (!inputsVisible) {
      await powerButton.evaluate((el) => {
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
      });
      await this.page.waitForTimeout(200);
      
      await powerButton.waitFor({ state: 'visible', timeout: 10000 });
      await powerButton.evaluate((el: HTMLElement) => el.click());
      
      await this.page.waitForTimeout(300);
      await numberInputs.first().waitFor({ state: 'visible', timeout: 5000 });
    }
  }

  async setMinPower(value: number): Promise<void> {
    await this.expandPowerRangeSection();
    const inputs = this.filtersPanel.locator('input[type="number"]');
    await inputs.first().fill(value.toString());
    await inputs.first().blur();
    await this.page.waitForTimeout(500);
  }

  async setMaxPower(value: number): Promise<void> {
    await this.expandPowerRangeSection();
    const inputs = this.filtersPanel.locator('input[type="number"]');
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
