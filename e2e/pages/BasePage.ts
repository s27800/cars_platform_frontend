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

  get header(): Locator {
    return this.page.locator('nav[aria-label="Main navigation"]');
  }

  get footer(): Locator {
    return this.page.locator('footer');
  }

  get spinner(): Locator {
    return this.page.locator('[data-testid="spinner"], .animate-spin');
  }

  get toast(): Locator {
    return this.page.locator('[aria-label="Notifications"]').locator('[role="alert"]').first();
  }

  get modal(): Locator {
    return this.page.locator('[role="dialog"], [data-testid="modal"]');
  }

  get hamburgerButton(): Locator {
    return this.page.locator('button[aria-controls="mobile-menu"]');
  }

  get mobileMenu(): Locator {
    return this.page.locator('#mobile-menu');
  }


  // ============ NAVIGATION METHODS ============

  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForLoading(): Promise<void> {
    await this.spinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }


  // ============ HEADER NAVIGATION ============

  async openHamburgerMenuIfMobile(): Promise<void> {

    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(500);
    
    const buttonCount = await this.hamburgerButton.count();

    if (buttonCount === 0)
      return;
    
    try {
      await this.hamburgerButton.waitFor({ state: 'visible', timeout: 3000 });
    } catch {
      return;
    }
    
    const isExpanded = await this.hamburgerButton.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {

      await this.hamburgerButton.click();
      
      try {
        await this.mobileMenu.waitFor({ state: 'visible', timeout: 5000 });
      } catch {

        await this.hamburgerButton.click();
        await this.mobileMenu.waitFor({ state: 'visible', timeout: 5000 });
      }
      
      await this.page.waitForTimeout(400);
    }
  }

  async closeHamburgerMenuIfOpen(): Promise<void> {
    const isVisible = await this.hamburgerButton.isVisible();

    if (isVisible) {
      const isExpanded = await this.hamburgerButton.getAttribute('aria-expanded');

      if (isExpanded === 'true') {
        await this.hamburgerButton.click();
        await this.mobileMenu.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
      }
    }
  }

  async clickLogo(): Promise<void> {
    await this.header.getByRole('link', { name: /carsplatform/i }).click();
  }

  private async getVisibleNavContainer(): Promise<Locator> {

    const hasHamburgerButton = await this.hamburgerButton.count() > 0;
    
    if (hasHamburgerButton) {

      await this.page.waitForTimeout(100);
      const isMobileMenuVisible = await this.mobileMenu.isVisible().catch(() => false);
      
      if (isMobileMenuVisible) {
        return this.mobileMenu;
      }
    }
    return this.header;
  }

  async navigateToCars(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    
    const mobileMenuVisible = await this.mobileMenu.isVisible().catch(() => false);
    
    if (mobileMenuVisible)
      await this.mobileMenu.getByRole('link', { name: /cars/i }).click();
    else
      await this.header.getByRole('link', { name: 'Cars', exact: true }).click();
  }

  async navigateToComparison(): Promise<void> {
    const container = await this.getVisibleNavContainer();
    await container.getByRole('link', { name: /comparison|porównanie/i }).click();
  }

  async navigateToLogin(): Promise<void> {
    const container = await this.getVisibleNavContainer();
    await container.getByRole('link', { name: /sign in/i }).click();
  }

  async navigateToRegister(): Promise<void> {
    const container = await this.getVisibleNavContainer();
    await container.getByRole('link', { name: /sign up/i }).click();
  }


  // ============ THEME & LANGUAGE ============

  async toggleTheme(): Promise<void> {
    await this.page.getByRole('button', { name: /theme|motyw/i }).click();
  }

  async changeLanguage(lang: 'en' | 'pl'): Promise<void> {
    await this.page.getByRole('button', { name: /language|język/i }).click();
    await this.page.getByRole('option', { name: new RegExp(lang === 'en' ? 'english' : 'polski', 'i') }).click();
  }


  // ============ UTILITY METHODS ============

  async getCurrentPath(): Promise<string> {
    return new URL(this.page.url()).pathname;
  }

  async waitForUrl(pattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(pattern);
  }

  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  async getLocalStorageItem(key: string): Promise<string | null> {
    return await this.page.evaluate((k) => localStorage.getItem(k), key);
  }

  async setLocalStorageItem(key: string, value: string): Promise<void> {
    await this.page.evaluate(({ k, v }) => localStorage.setItem(k, v), { k: key, v: value });
  }

  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }
}
