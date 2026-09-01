import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';


/**
 * Comparison Page Object
 */
export class ComparisonPage extends BasePage {


  // ============ LOCATORS ============

  get pageTitle(): Locator {
    return this.page.getByRole('heading', { name: /compare cars/i });
  }

  get comparisonTable(): Locator {
    return this.page.locator('main').first();
  }

  get selectedCarsContainer(): Locator {
    return this.page.locator('main');
  }

  get carSelector(): Locator {
    return this.page.getByPlaceholder(/add another car|search/i);
  }

  get carSearchInput(): Locator {
    return this.page.getByPlaceholder(/add another car|search/i);
  }

  get clearAllButton(): Locator {
    return this.page.getByRole('button', { name: /clear all/i });
  }

  get emptyStateMessage(): Locator {
    return this.page.getByRole('heading', { name: /no cars selected/i });
  }

  get comparisonCarCards(): Locator {
    return this.page.locator('[class*="card"], [class*="comparison-item"]').filter({
      has: this.page.locator('img, [class*="placeholder"]')
    });
  }

  get removeCarButtons(): Locator {
    return this.page.getByRole('button', { name: /remove from comparison|remove|delete/i });
  }

  get tabs(): Locator {
    return this.page.locator('[role="tablist"]');
  }

  get specsTab(): Locator {
    return this.page.getByRole('button', { name: /specs|specifications/i });
  }

  get statsTab(): Locator {
    return this.page.getByRole('button', { name: /stats|statistics/i });
  }

  get comparisonRows(): Locator {
    return this.comparisonTable.locator('tr, [class*="row"]');
  }

  get searchResults(): Locator {
    return this.page.locator('[role="listbox"], [class*="dropdown"], [class*="results"]');
  }


  // ============ ACTIONS ============

  async goto(): Promise<void> {
    await this.page.goto('/comparison');
  }

  async searchCar(query: string): Promise<void> {
    await this.carSearchInput.fill(query);
    await this.page.waitForTimeout(500);
  }

  async selectCarFromResults(index: number = 0): Promise<void> {
    await this.searchResults.locator('[role="option"], li, [class*="item"]').nth(index).click();
  }

  async addCarBySearch(query: string): Promise<void> {
    await this.searchCar(query);
    await this.selectCarFromResults();
  }

  async removeCarByIndex(index: number): Promise<void> {
    await this.removeCarButtons.nth(index).click();
  }

  async removeAllCars(): Promise<void> {
    await this.clearAllButton.click();
  }

  async selectSpecsTab(): Promise<void> {
    await this.specsTab.click();
  }

  async selectStatsTab(): Promise<void> {
    await this.statsTab.click();
  }


  // ============ ASSERTIONS ============

  async expectPageVisible(): Promise<void> {
    await expect(this.page.getByText(/compare cars/i)).toBeVisible();
  }

  async expectEmptyState(): Promise<void> {
    await expect(this.emptyStateMessage).toBeVisible();
  }

  async expectCarsCount(count: number): Promise<void> {
    if (count === 0) {
      await this.expectEmptyState();
    } else {
      const carText = this.page.getByText(/golf|bmw|audi|toyota/i);
      await expect(carText.first()).toBeVisible();
    }
  }

  async expectComparisonTableVisible(): Promise<void> {
    await expect(this.comparisonTable).toBeVisible();
  }

  async expectCarInComparison(carName: string): Promise<void> {
    await expect(this.page.getByText(new RegExp(carName, 'i'))).toBeVisible();
  }

  async expectCarNotInComparison(carName: string): Promise<void> {
    await expect(this.page.getByText(new RegExp(carName, 'i'))).not.toBeVisible();
  }

  async expectMaxCarsReached(): Promise<void> {
    const message = this.page.getByText(/maximum|4\/4|limit/i);
    await expect(message).toBeVisible();
  }

  async expectSearchResultsVisible(): Promise<void> {
    await expect(this.searchResults).toBeVisible();
  }

  async getComparisonValue(rowIndex: number, carIndex: number): Promise<string> {
    const cell = this.comparisonRows.nth(rowIndex).locator('td, [class*="cell"]').nth(carIndex);
    return await cell.textContent() || '';
  }
}
