import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';


/**
 * Cars Search Page Object
 */
export class CarsSearchPage extends BasePage {


  // ============ LOCATORS ============

  get searchInput(): Locator {
    return this.page.getByRole('textbox', { name: /search cars/i });
  }

  get filtersPanel(): Locator {
    return this.page.locator('aside');
  }

  get mobileFiltersDrawer(): Locator {
    return this.page.locator('.fixed.inset-0 .shadow-xl').or(
      this.page.locator('.fixed.inset-0 [class*="overflow-y"]')
    ).or(
      this.page.locator('[role="dialog"]').filter({ has: this.page.locator('select') })
    ).first();
  }

  async getActiveFiltersContainer(): Promise<Locator> {

    const mobileDrawer = this.mobileFiltersDrawer;
    const isMobileDrawerVisible = await mobileDrawer.isVisible().catch(() => false);
    
    if (isMobileDrawerVisible)
      return mobileDrawer;

    return this.filtersPanel;
  }

  get mobileFiltersButton(): Locator {
    return this.page.getByRole('button', { name: /filters|filtry/i });
  }

  get resultsGrid(): Locator {
    return this.page.locator('main').locator('[data-testid="cars-grid"], .grid').first();
  }

  get carCards(): Locator {
    return this.page.locator('main h3').locator('xpath=ancestor::div[contains(@class, "rounded")]');
  }

  get pagination(): Locator {
    return this.page.locator('main').locator('div').filter({
      has: this.page.locator('button[aria-label="Previous page"]')
    }).first();
  }

  get sortSelect(): Locator {
    return this.page.locator('select').filter({ 
      has: this.page.locator('option', { hasText: /A-Z|Z-A|High to Low|Low to High|Domyślnie/i })
    }).first();
  }

  get pageSizeSelect(): Locator {
    return this.page.locator('select').filter({ 
      has: this.page.locator('option', { hasText: /12|24|48/ })
    }).first();
  }

  get noResultsMessage(): Locator {
    return this.page.getByText(/no results|brak wyników|no cars found/i);
  }

  get loading(): Locator {
    return this.page.locator('[data-testid="loading"], .animate-pulse, .skeleton');
  }

  get resetFiltersButton(): Locator {
    return this.page.getByRole('button', { name: /reset|wyczyść|clear/i });
  }

  get resultsCount(): Locator {
    return this.page.locator('[data-testid="results-count"]').or(
      this.page.getByText(/found|znaleziono|results|wyników/i)
    );
  }


  // ============ FILTER LOCATORS ============

  getBrandFilter(): Locator {
    return this.filtersPanel.locator('[data-testid="brand-filter"], select, [role="combobox"]').first();
  }

  getModelFilter(): Locator {
    return this.filtersPanel.locator('[data-testid="model-filter"]');
  }

  getBodyTypeCheckboxes(): Locator {
    return this.filtersPanel.locator('input[type="checkbox"]');
  }

  getEngineTypeFilter(): Locator {
    return this.filtersPanel.locator('[data-testid="engine-type-filter"]');
  }

  getMinPowerInput(): Locator {
    return this.filtersPanel.locator('input[name*="minPower"], input[placeholder*="min"]').first();
  }

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

    const container = await this.ensureMobileDrawerOpenAndGetContainer();
    
    const resetBtn = container.getByRole('button', { name: /reset|wyczyść|clear/i });
    await resetBtn.waitFor({ state: 'visible', timeout: 5000 });
    await resetBtn.scrollIntoViewIfNeeded();
    
    const currentUrl = this.page.url();
    const hasFilterParams = currentUrl.includes('brandIds') || currentUrl.includes('bodyTypeIds') || currentUrl.includes('engineTypeIds');
    
    await resetBtn.click({ force: true });
    
    await this.page.waitForLoadState('networkidle').catch(() => {});
    
    if (hasFilterParams) {
      const maxRetries = 3;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          await this.page.waitForFunction(
            (patterns) => !patterns.some(p => window.location.href.includes(p)),
            ['brandIds=', 'bodyTypeIds=', 'engineTypeIds='],
            { timeout: 3000 }
          );

          break;
        } catch {
          if (attempt < maxRetries - 1) {
            await resetBtn.click({ force: true });
            await this.page.waitForTimeout(300);
          }
        }
      }
    }
    
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(300);
  }

  async openMobileFilters(): Promise<void> {
    await this.mobileFiltersButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(300);
    await this.mobileFiltersButton.click({ force: true });

    await this.mobileFiltersDrawer.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(300);
  }

  async openFiltersIfMobile(isMobile: boolean): Promise<void> {
    if (isMobile) {
      const isFilterButtonVisible = await this.mobileFiltersButton.isVisible();

      if (isFilterButtonVisible) {
        await this.mobileFiltersButton.click();
        await this.mobileFiltersDrawer.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.waitForTimeout(300);
      }
    }
  }


  // ============ FILTER ACTIONS ============

  private async ensureMobileDrawerOpenAndGetContainer(): Promise<Locator> {

    const drawer = this.mobileFiltersDrawer;
    const isDrawerAlreadyVisible = await drawer.isVisible().catch(() => false);

    if (isDrawerAlreadyVisible) {
      const drawerSelect = drawer.locator('select').first();

      if (await drawerSelect.isVisible().catch(() => false))
        return drawer;
    }
    
    const viewport = this.page.viewportSize();
    const isMobileViewport = viewport && viewport.width < 768;
    
    if (isMobileViewport) {
      const mobileFilterBtn = this.mobileFiltersButton;
      
      for (let attempt = 0; attempt < 3; attempt++) {
        const isBtnVisible = await mobileFilterBtn.isVisible().catch(() => false);

        if (isBtnVisible) {
          await mobileFilterBtn.click();
          
          await this.page.waitForTimeout(300);
          
          try {
            await drawer.waitFor({ state: 'visible', timeout: 3000 });
            
            const drawerSelect = drawer.locator('select').first();
            await drawerSelect.waitFor({ state: 'visible', timeout: 2000 });
            
            return drawer;
          } catch {
            await this.page.waitForTimeout(200);
          }
        }
      }
      
      await mobileFilterBtn.click({ force: true });
      await this.page.waitForTimeout(500);
      
      return drawer;
    }
    
    return this.filtersPanel;
  }

  async selectBrand(brandName: string): Promise<void> {
    const container = await this.ensureMobileDrawerOpenAndGetContainer();
    
    await this.page.waitForTimeout(200);
    
    const brandSelect = container.locator('select').first();
    
    for (let attempt = 0; attempt < 3; attempt++) {
      const isVisible = await brandSelect.isVisible().catch(() => false);

      if (isVisible)
        break;
      
      await this.ensureMobileDrawerOpenAndGetContainer();
      await this.page.waitForTimeout(300);
    }
    
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
    
    await this.page.waitForTimeout(300);
    
    const powerButton = container.locator('button').filter({ hasText: /power|moc/i }).first();
    const numberInputs = container.locator('input[type="number"]');
    
    for (let attempt = 0; attempt < 3; attempt++) {
      const inputsVisible = await numberInputs.first().isVisible().catch(() => false);

      if (inputsVisible)
        break;
      
      try {
        await powerButton.waitFor({ state: 'attached', timeout: 3000 });
      } catch {
        await this.ensureMobileDrawerOpenAndGetContainer();
        await this.page.waitForTimeout(200);
        
        continue;
      }
      
      await powerButton.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
      await this.page.waitForTimeout(200);
      
      try {
        await powerButton.waitFor({ state: 'visible', timeout: 5000 });
        await powerButton.click();
      } catch {
        await powerButton.click({ force: true });
      }
      
      await this.page.waitForTimeout(500);
      
      const appeared = await numberInputs.first().isVisible().catch(() => false);
      
      if (appeared)
        break;
      
      await this.page.waitForTimeout(300);
    }
    
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
    await this.page.waitForLoadState('domcontentloaded', { timeout });
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
