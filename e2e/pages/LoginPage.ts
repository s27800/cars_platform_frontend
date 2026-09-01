import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';


/**
 * Login Page Object
 */
export class LoginPage extends BasePage {


  // ============ LOCATORS ============

  get usernameInput(): Locator {
    return this.page.locator('input[name="username"]');
  }

  get passwordInput(): Locator {
    return this.page.locator('input[name="password"]');
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: /sign in/i });
  }

  get errorMessage(): Locator {
    return this.page.locator('.bg-red-50, [class*="bg-red-900"], [class*="border-red-200"]').first();
  }

  get toastMessage(): Locator {
    return this.page.locator('[aria-label="Notifications"] [role="alert"]');
  }

  get togglePasswordButton(): Locator {
    return this.passwordInput.locator('..').locator('button');
  }

  get registerLink(): Locator {
    return this.page.locator('main').getByRole('link', { name: /sign up/i });
  }

  get loginForm(): Locator {
    return this.page.locator('form');
  }

  get pageTitle(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }


  // ============ ACTIONS ============

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSubmit();
  }

  async loginAndWaitForResponse(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    
    const responsePromise = this.page.waitForResponse(
      response => response.url().includes('/auth/login'),
      { timeout: 10000 }
    );
    
    await this.submitButton.click();
    await responsePromise;
    
    await this.page.waitForTimeout(500);
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.togglePasswordButton.click();
  }

  async clickRegisterLink(): Promise<void> {
    await this.registerLink.click();
  }


  // ============ ASSERTIONS ============

  async expectPageVisible(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectError(text?: string): Promise<void> {
    const errorLocator = this.errorMessage.or(this.toastMessage);

    await expect(errorLocator.first()).toBeVisible({ timeout: 5000 });

    if (text)
      await expect(errorLocator.first()).toContainText(text);
  }

  async expectSubmitDisabled(): Promise<void> {
    await expect(this.submitButton).toBeDisabled();
  }

  async expectSubmitEnabled(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
  }

  async expectNoError(): Promise<void> {
    await expect(this.errorMessage).not.toBeVisible();
  }

  async expectLoginSuccess(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/login/);
  }

  async expectUsernameError(): Promise<void> {
    const error = this.page.locator('input[name="username"] + p, input[name="username"] ~ p');
    await expect(error).toBeVisible();
  }

  async expectPasswordError(): Promise<void> {
    const error = this.page.locator('input[name="password"]').locator('..').locator('p');
    await expect(error).toBeVisible();
  }

  async expectPasswordVisible(): Promise<void> {
    await expect(this.passwordInput).toHaveAttribute('type', 'text');
  }

  async expectPasswordHidden(): Promise<void> {
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
  }
}
