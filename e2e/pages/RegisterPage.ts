import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';


/**
 * Register Page Object
 */
export class RegisterPage extends BasePage {


  // ============ LOCATORS ============

  get usernameInput(): Locator {
    return this.page.locator('input[name="username"]');
  }

  get emailInput(): Locator {
    return this.page.locator('input[name="email"]');
  }

  get passwordInput(): Locator {
    return this.page.locator('input[name="password"]');
  }

  get confirmPasswordInput(): Locator {
    return this.page.locator('input[name="confirmPassword"]');
  }

  get firstNameInput(): Locator {
    return this.page.locator('input[name="firstName"]');
  }

  get lastNameInput(): Locator {
    return this.page.locator('input[name="lastName"]');
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: /create account|załóż konto/i });
  }

  get errorMessage(): Locator {
    return this.page.locator('.bg-red-50, [class*="bg-red-900"], [class*="border-red-200"]').first();
  }

  get loginLink(): Locator {
    return this.page.locator('main').getByRole('link', { name: /sign in/i });
  }

  get pageTitle(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }


  // ============ ACTIONS ============

  async goto(): Promise<void> {
    await this.page.goto('/register');
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.fill(password);
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async clickSubmit(): Promise<void> {
    await expect(this.submitButton).toBeEnabled({ timeout: 5000 });
    await this.submitButton.click();
  }

  /** Click submit button even if disabled */
  async forceClickSubmit(): Promise<void> {
    await this.submitButton.click({ force: true });
  }

  /** Check that the submit button is disabled */
  async expectSubmitDisabled(): Promise<void> {
    await expect(this.submitButton).toBeDisabled();
  }

  /** Check that the submit button is enabled */
  async expectSubmitEnabled(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
  }

  /** Fill all registration fields */
  async fillRegistrationForm(data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }): Promise<void> {
    await this.fillUsername(data.username);
    await this.fillEmail(data.email);
    await this.fillFirstName(data.firstName);
    await this.fillLastName(data.lastName);
    await this.fillPassword(data.password);
    await this.fillConfirmPassword(data.confirmPassword);
  }

  /** Perform complete registration flow */
  async register(data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }): Promise<void> {
    await this.fillRegistrationForm(data);
    await this.clickSubmit();
  }

  async clickLoginLink(): Promise<void> {
    await this.loginLink.click();
  }


  // ============ ASSERTIONS ============

  async expectPageVisible(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectError(text?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (text) {
      await expect(this.errorMessage).toContainText(text);
    }
  }

  async expectNoError(): Promise<void> {
    await expect(this.errorMessage).not.toBeVisible();
  }

  async expectRegistrationSuccess(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/register/);
  }

  async expectValidationError(field: string): Promise<void> {
    const input = this.page.locator(`input[name="${field}"]`);
    const errorText = input.locator('..').locator('p, span[class*="text-red"], span[class*="error"]');
    await expect(errorText).toBeVisible();
  }
}
