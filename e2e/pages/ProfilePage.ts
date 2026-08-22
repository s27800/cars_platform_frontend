import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';


/**
 * Profile Page Object
 */
export class ProfilePage extends BasePage {


  // ============ LOCATORS ============

  /** Page title */
  get pageTitle(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  /** User info section */
  get userInfoSection(): Locator {
    return this.page.locator('main').first();
  }

  /** Username display */
  get usernameDisplay(): Locator {
    return this.page.getByText(/@\w+/);
  }

  /** User name display */
  get userNameDisplay(): Locator {
    return this.page.locator('main').getByRole('heading').first();
  }

  /** Email display */
  get emailDisplay(): Locator {
    return this.page.getByText(/@.*\.(com|pl|org|net)/i);
  }

  /** Tabs navigation */
  get tabsNav(): Locator {
    return this.page.locator('[role="tablist"]');
  }

  /** Profile/Edit Profile tab */
  get profileTab(): Locator {
    return this.page.getByRole('tab', { name: /edit profile/i });
  }

  /** Password tab */
  get passwordTab(): Locator {
    return this.page.getByRole('tab', { name: /password/i });
  }

  /** Activity tab (My Activity) */
  get activityTab(): Locator {
    return this.page.getByRole('tab', { name: /my activity|activity/i });
  }


  // ============ PROFILE EDIT FORM ============

  /** Edit button */
  get editButton(): Locator {
    return this.profileTab;
  }

  /** First name input */
  get firstNameInput(): Locator {
    return this.page.getByLabel(/first name|imię/i);
  }

  /** Last name input */
  get lastNameInput(): Locator {
    return this.page.getByLabel(/last name|nazwisko/i);
  }

  /** Save profile button */
  get saveProfileButton(): Locator {
    return this.page.getByRole('button', { name: /save changes|zapisz/i });
  }

  /** Cancel edit button */
  get cancelEditButton(): Locator {
    return this.page.getByRole('button', { name: /cancel|anuluj/i });
  }


  // ============ PASSWORD CHANGE FORM ============

  /** Current password input */
  get currentPasswordInput(): Locator {
    return this.page.locator('input[name="currentPassword"], input[name="oldPassword"]');
  }

  /** New password input */
  get newPasswordInput(): Locator {
    return this.page.locator('input[name="newPassword"]');
  }

  /** Confirm password input */
  get confirmPasswordInput(): Locator {
    return this.page.locator('input[name="confirmPassword"], input[name="confirmNewPassword"]');
  }

  /** Change password button */
  get changePasswordButton(): Locator {
    return this.page.getByRole('button', { name: /change password|zmień hasło/i });
  }


  // ============ ACTIVITY SECTION ============

  /** Activity type selector */
  get activityTypeSelector(): Locator {
    return this.page.locator('[data-testid="activity-type"], .activity-type');
  }

  /** Reviews tab in activity */
  get reviewsActivityTab(): Locator {
    return this.page.getByRole('button', { name: /reviews|recenzje/i });
  }

  /** Fuel reports tab in activity */
  get fuelReportsActivityTab(): Locator {
    return this.page.getByRole('button', { name: /fuel reports|raporty spalania/i });
  }

  /** Proposals tab in activity */
  get proposalsActivityTab(): Locator {
    return this.page.getByRole('button', { name: /proposals|propozycje/i });
  }

  /** Activity items list */
  get activityItems(): Locator {
    return this.page.locator('[data-testid="activity-item"], .activity-item, article');
  }


  // ============ ACTIONS ============

  async goto(): Promise<void> {
    await this.page.goto('/profile');
  }

  async gotoPassword(): Promise<void> {
    await this.page.goto('/profile/password');
  }

  async gotoActivity(type: 'reviews' | 'reports' | 'proposals'): Promise<void> {
    await this.page.goto(`/profile/${type}`);
  }

  async clickProfileTab(): Promise<void> {
    await this.profileTab.click();
  }

  async clickPasswordTab(): Promise<void> {
    await this.passwordTab.click();
  }

  async clickActivityTab(): Promise<void> {
    await this.activityTab.click();
  }

  async clickEdit(): Promise<void> {
    await this.editButton.click();
  }

  async fillFirstName(value: string): Promise<void> {
    await this.firstNameInput.fill(value);
  }

  async fillLastName(value: string): Promise<void> {
    await this.lastNameInput.fill(value);
  }

  async saveProfile(): Promise<void> {
    await this.saveProfileButton.click();
  }

  async cancelEdit(): Promise<void> {
    await this.cancelEditButton.click();
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.changePasswordButton.click();
  }

  async fillPasswordForm(currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async expectChangePasswordButtonDisabled(): Promise<void> {
    await expect(this.changePasswordButton).toBeDisabled();
  }

  async expectChangePasswordButtonEnabled(): Promise<void> {
    await expect(this.changePasswordButton).toBeEnabled();
  }

  async selectActivityType(type: 'reviews' | 'reports' | 'proposals'): Promise<void> {
    switch (type) {
      case 'reviews':
        await this.reviewsActivityTab.click();
        break;
      case 'reports':
        await this.fuelReportsActivityTab.click();
        break;
      case 'proposals':
        await this.proposalsActivityTab.click();
        break;
    }
  }


  // ============ ASSERTIONS ============

  async expectPageVisible(): Promise<void> {
    await expect(this.page.locator('main')).toBeVisible();
  }

  async expectProfileData(firstName: string, lastName: string): Promise<void> {
    const fullName = `${firstName} ${lastName}`;
    await expect(this.page.getByRole('heading', { name: fullName })).toBeVisible();
  }

  async expectEditMode(): Promise<void> {
    await expect(this.firstNameInput.or(this.page.getByLabel(/first/i))).toBeVisible();
  }

  async expectViewMode(): Promise<void> {
    await expect(this.profileTab).toBeVisible();
  }

  async expectPasswordChangeSuccess(): Promise<void> {
    await expect(this.toast).toContainText(/success|sukces|changed/i);
  }

  async expectPasswordChangeError(): Promise<void> {
    await expect(this.toast).toContainText(/error|błąd|incorrect/i);
  }

  async expectActivityItemsCount(count: number): Promise<void> {
    await expect(this.activityItems).toHaveCount(count);
  }

  async expectActivityItemsVisible(): Promise<void> {
    await expect(this.activityItems.first()).toBeVisible();
  }

  async expectUnauthorizedRedirect(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }

  async getUserDisplayName(): Promise<string> {
    return await this.userNameDisplay.textContent() || '';
  }
}
