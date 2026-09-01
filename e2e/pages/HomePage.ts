import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';


/**
 * Home Page Object
 */
export class HomePage extends BasePage {


  // ============ LOCATORS ============

  get heroSection(): Locator {
    return this.page.locator('[data-testid="hero"], .hero, section').first();
  }

  get heroTitle(): Locator {
    return this.heroSection.getByRole('heading', { level: 1 });
  }

  get heroSearchInput(): Locator {
    return this.heroSection.getByPlaceholder(/search|szukaj/i);
  }

  get heroSearchButton(): Locator {
    return this.heroSection.getByRole('button', { name: /search|szukaj/i });
  }

  get brandsSection(): Locator {
    return this.page.locator('[data-testid="brands-section"], .brands-section');
  }

  get brandCards(): Locator {
    return this.brandsSection.locator('[data-testid="brand-card"], .brand-card, a');
  }

  get popularCarsSection(): Locator {
    return this.page.locator('[data-testid="popular-cars"], .popular-cars');
  }

  get popularCarCards(): Locator {
    return this.popularCarsSection.locator('[data-testid="car-card"], .car-card, article');
  }

  get ctaSection(): Locator {
    return this.page.locator('[data-testid="cta-section"], .cta-section');
  }

  get browseAllCarsButton(): Locator {
    return this.page.getByRole('link', { name: /browse|przeglądaj|all cars/i });
  }


  // ============ ACTIONS ============

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async searchFromHero(query: string): Promise<void> {
    await this.heroSearchInput.fill(query);
    await this.heroSearchButton.click();
  }

  async clickBrandCard(index: number = 0): Promise<void> {
    await this.brandCards.nth(index).click();
  }

  async clickBrandByName(name: string): Promise<void> {
    await this.brandCards.filter({ hasText: new RegExp(name, 'i') }).click();
  }

  async clickPopularCar(index: number = 0): Promise<void> {
    await this.popularCarCards.nth(index).click();
  }

  async clickBrowseAllCars(): Promise<void> {
    await this.browseAllCarsButton.click();
  }


  // ============ ASSERTIONS ============

  async expectPageVisible(): Promise<void> {
    await expect(this.heroSection).toBeVisible();
  }

  async expectHeroTitle(text: string): Promise<void> {
    await expect(this.heroTitle).toContainText(text);
  }

  async expectBrandsVisible(): Promise<void> {
    await expect(this.brandsSection).toBeVisible();
    await expect(this.brandCards.first()).toBeVisible();
  }

  async expectBrandCount(count: number): Promise<void> {
    await expect(this.brandCards).toHaveCount(count);
  }

  async expectPopularCarsVisible(): Promise<void> {
    await expect(this.popularCarsSection).toBeVisible();
  }

  async expectPopularCarsCount(count: number): Promise<void> {
    await expect(this.popularCarCards).toHaveCount(count);
  }

  async expectSearchRedirect(): Promise<void> {
    await expect(this.page).toHaveURL(/\/cars/);
  }
}
