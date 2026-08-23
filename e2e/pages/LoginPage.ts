import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';


/**
 * Login Page Object
 */
export class LoginPage extends BasePage {


  // ============ LOCATORS ============

  /** Username input field */
  get usernameInput(): Locator {
    return this.page.locator('input[name="username"]');
  }

  /** Password input field */
  get passwordInput(): Locator {
    return this.page.locator('input[name="password"]');
  }

  /** Submit button */
  get submitButton(): Locator {
    return this.page.getByRole('button', { name: /sign in/i });
  }

  /** Error message container */
  get errorMessage(): Locator {
    return this.page.locator('.bg-red-50, [class*="bg-red-900"], [class*="border-red-200"]').first();
  }

  /** Toast notification */
  get toastMessage(): Locator {
    return this.page.locator('[aria-label="Notifications"] [role="alert"]');
  }

  /** Show/hide password button */
  get togglePasswordButton(): Locator {
    return this.passwordInput.locator('..').locator('button');
  }

  /** Link to register page (in main content, not header) */
  get registerLink(): Locator {
    return this.page.locator('main').getByRole('link', { name: /sign up/i });
  }

  /** Form element */
  get loginForm(): Locator {
    return this.page.locator('form');
  }

  /** Page title */
  get pageTitle(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }


  // ============ ACTIONS ============

  /** Navigate to login page */
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

   /** Fill username field */
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /** Fill password field */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /** Click submit button */
  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  /** Perform complete login flow */
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSubmit();
  }

  /** Perform login and wait for API response (for testing failed logins) */
  async loginAndWaitForResponse(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    
    // Wait for the login API call to complete
    const responsePromise = this.page.waitForResponse(
      response => response.url().includes('/auth/login'),
      { timeout: 10000 }
    );
    
    await this.submitButton.click();
    await responsePromise;
    
    await this.page.waitForTimeout(500);
  }

  /** Toggle password visibility */
  async togglePasswordVisibility(): Promise<void> {
    await this.togglePasswordButton.click();
  }

  /** Click register link */
  async clickRegisterLink(): Promise<void> {
    await this.registerLink.click();
  }


  // ============ ASSERTIONS ============

  /** Expect login page to be visible */
  async expectPageVisible(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  /** Expect error message with specific text (toast or inline error) */
  async expectError(text?: string): Promise<void> {
    // Wait for either toast or inline error to appear
    const errorLocator = this.errorMessage.or(this.toastMessage);
    await expect(errorLocator.first()).toBeVisible({ timeout: 5000 });
    if (text) {
      await expect(errorLocator.first()).toContainText(text);
    }
  }

  /** Expect submit button to be disabled (for form validation) */
  async expectSubmitDisabled(): Promise<void> {
    await expect(this.submitButton).toBeDisabled();
  }

  /** Expect submit button to be enabled */
  async expectSubmitEnabled(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
  }

  /** Expect no error message */
  async expectNoError(): Promise<void> {
    await expect(this.errorMessage).not.toBeVisible();
  }

  /** Expect redirect after successful login */
  async expectLoginSuccess(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/login/);
  }

  /** Expect username validation error */
  async expectUsernameError(): Promise<void> {
    const error = this.page.locator('input[name="username"] + p, input[name="username"] ~ p');
    await expect(error).toBeVisible();
  }

  /** Expect password validation error */
  async expectPasswordError(): Promise<void> {
    const error = this.page.locator('input[name="password"]').locator('..').locator('p');
    await expect(error).toBeVisible();
  }

  /** Expect password to be visible (not masked) */
  async expectPasswordVisible(): Promise<void> {
    await expect(this.passwordInput).toHaveAttribute('type', 'text');
  }

  /** Expect password to be hidden (masked) */
  async expectPasswordHidden(): Promise<void> {
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
  }
}
