import { Page, Locator } from '@playwright/test';


/**
 * Base Page Object class with common functionality
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }


  // ============ COMMON LOCATORS ============

  /** Header component */
  get header(): Locator {
    return this.page.locator('nav[aria-label="Main navigation"]');
  }

  /** Footer component */
  get footer(): Locator {
    return this.page.locator('footer');
  }

  /** Loading spinner */
  get spinner(): Locator {
    return this.page.locator('[data-testid="spinner"], .animate-spin');
  }

  /** Toast notification */
  get toast(): Locator {
    return this.page.locator('[aria-label="Notifications"]').locator('[role="alert"]').first();
  }

  /** Modal dialog */
  get modal(): Locator {
    return this.page.locator('[role="dialog"], [data-testid="modal"]');
  }


  // ============ NAVIGATION METHODS ============

  /** Navigate to a specific path */
  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /** Wait for page to be fully loaded */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /** Wait for spinner to disappear */
  async waitForLoading(): Promise<void> {
    await this.spinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }


  // ============ HEADER NAVIGATION ============

  /** Click on logo to go to home */
  async clickLogo(): Promise<void> {
    await this.header.getByRole('link', { name: /carsplatform/i }).click();
  }

  /** Navigate to cars search page via header */
  async navigateToCars(): Promise<void> {
    await this.header.waitFor({ state: 'visible' });
    await this.page.waitForLoadState('domcontentloaded');
    // Use exact match to avoid matching "CarsPlatform" in the logo
    await this.header.getByRole('link', { name: 'Cars', exact: true }).click();
  }

  /** Navigate to comparison page via header */
  async navigateToComparison(): Promise<void> {
    await this.header.getByRole('link', { name: /comparison|porównanie/i }).click();
  }

  /** Navigate to login page via header */
  async navigateToLogin(): Promise<void> {
    await this.header.getByRole('link', { name: /sign in/i }).click();
  }

  /** Navigate to register page via header */
  async navigateToRegister(): Promise<void> {
    await this.header.getByRole('link', { name: /sign up/i }).click();
  }


  // ============ THEME & LANGUAGE ============

  /** Toggle theme (light/dark) */
  async toggleTheme(): Promise<void> {
    await this.page.getByRole('button', { name: /theme|motyw/i }).click();
  }

  /** Change language */
  async changeLanguage(lang: 'en' | 'pl'): Promise<void> {
    await this.page.getByRole('button', { name: /language|język/i }).click();
    await this.page.getByRole('menuitem', { name: new RegExp(lang === 'en' ? 'english' : 'polski', 'i') }).click();
  }


  // ============ UTILITY METHODS ============

  /** Get current URL path */
  async getCurrentPath(): Promise<string> {
    return new URL(this.page.url()).pathname;
  }

  /** Wait for URL to match pattern */
  async waitForUrl(pattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(pattern);
  }

  /** Take screenshot */
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  /** Get localStorage item */
  async getLocalStorageItem(key: string): Promise<string | null> {
    return await this.page.evaluate((k) => localStorage.getItem(k), key);
  }

  /** Set localStorage item */
  async setLocalStorageItem(key: string, value: string): Promise<void> {
    await this.page.evaluate(({ k, v }) => localStorage.setItem(k, v), { k: key, v: value });
  }

  /** Clear localStorage */
  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }
}
