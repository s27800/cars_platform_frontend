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

  /** Hamburger menu button (mobile only) */
  get hamburgerButton(): Locator {
    // The hamburger button has aria-controls="mobile-menu" which is more reliable
    return this.page.locator('button[aria-controls="mobile-menu"]');
  }

  /** Mobile menu container */
  get mobileMenu(): Locator {
    return this.page.locator('#mobile-menu');
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

  /** Open hamburger menu if on mobile (menu button is visible) */
  async openHamburgerMenuIfMobile(): Promise<void> {

    // Wait for page to be ready
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(500);
    
    // Check if hamburger button exists and is visible
    const buttonCount = await this.hamburgerButton.count();
    if (buttonCount === 0) return;
    
    // Wait for button to be visible and stable
    try {
      await this.hamburgerButton.waitFor({ state: 'visible', timeout: 3000 });
    } catch {
      return;
    }
    
    const isExpanded = await this.hamburgerButton.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {

      // Click the button
      await this.hamburgerButton.click();
      
      // Wait for menu to appear - retry if needed
      try {
        await this.mobileMenu.waitFor({ state: 'visible', timeout: 5000 });
      } catch {

        // If menu didn't appear, try clicking again
        await this.hamburgerButton.click();
        await this.mobileMenu.waitFor({ state: 'visible', timeout: 5000 });
      }
      
      await this.page.waitForTimeout(400);
    }
  }

  /** Close hamburger menu if open */
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

  /** Click on logo to go to home */
  async clickLogo(): Promise<void> {
    await this.header.getByRole('link', { name: /carsplatform/i }).click();
  }

  /** Get navigation container - mobile menu if visible, otherwise header */
  private async getVisibleNavContainer(): Promise<Locator> {

    // On mobile, if hamburger button exists, check if mobile menu is open
    const hasHamburgerButton = await this.hamburgerButton.count() > 0;
    
    if (hasHamburgerButton) {

      // Wait for any animations
      await this.page.waitForTimeout(100);
      const isMobileMenuVisible = await this.mobileMenu.isVisible().catch(() => false);
      
      if (isMobileMenuVisible) {
        return this.mobileMenu;
      }
    }
    return this.header;
  }

  /** Navigate to cars search page via header or mobile menu */
  async navigateToCars(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    
    // Check if we need to use mobile menu
    const mobileMenuVisible = await this.mobileMenu.isVisible().catch(() => false);
    
    if (mobileMenuVisible) {

      // Click the Cars link in mobile menu
      await this.mobileMenu.getByRole('link', { name: /cars/i }).click();
    } else {
      
      // Use desktop header navigation
      await this.header.getByRole('link', { name: 'Cars', exact: true }).click();
    }
  }

  /** Navigate to comparison page via header or mobile menu */
  async navigateToComparison(): Promise<void> {
    const container = await this.getVisibleNavContainer();
    await container.getByRole('link', { name: /comparison|porównanie/i }).click();
  }

  /** Navigate to login page via header or mobile menu */
  async navigateToLogin(): Promise<void> {
    const container = await this.getVisibleNavContainer();
    await container.getByRole('link', { name: /sign in/i }).click();
  }

  /** Navigate to register page via header or mobile menu */
  async navigateToRegister(): Promise<void> {
    const container = await this.getVisibleNavContainer();
    await container.getByRole('link', { name: /sign up/i }).click();
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
