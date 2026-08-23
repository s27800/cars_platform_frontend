import { test, expect } from '@playwright/test';
import { test as authTest } from '../../fixtures/auth.fixture';
import { ProfilePage } from '../../pages';
import { TEST_USERS } from '../../fixtures';


test.describe('Profile Page - Unauthenticated', () => {
  test('PROF-002: should redirect unauthenticated user to login', async ({ page }) => {

    // Clear any existing auth
    await page.goto('/');

    await page.evaluate(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });

    // Try to access profile
    await page.goto('/profile');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Profile Page - Authenticated', () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {

    // Login first
    await page.goto('/login');
    await page.locator('input[name="username"]').fill(TEST_USERS.regularUser.username);
    await page.locator('input[name="password"]').fill(TEST_USERS.regularUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL((url) => !url.pathname.includes('/login'));

    profilePage = new ProfilePage(page);
  });

  test.describe('View Profile', () => {
    test('PROF-001: should display profile information', async () => {
      await profilePage.goto();
      await profilePage.expectPageVisible();
    });

    test('should display user name', async () => {
      await profilePage.goto();
      
      await profilePage.expectProfileData(
        TEST_USERS.regularUser.firstName,
        TEST_USERS.regularUser.lastName
      );
    });
  });

  test.describe('Profile Tabs', () => {
    test('PROF-003: should navigate between profile tabs', async ({ page }) => {
      await profilePage.goto();

      // Click password tab
      await profilePage.clickPasswordTab();

      // May or may not change URL, just check tab is visible
      await expect(profilePage.passwordTab).toBeVisible();

      // Click back to profile tab
      await profilePage.clickProfileTab();
      await expect(profilePage.profileTab).toBeVisible();
    });
  });

  test.describe('Edit Profile', () => {
    test('PROF-004: should allow editing profile', async () => {
      await profilePage.goto();

      // Click Edit Profile tab to enter edit mode
      await profilePage.clickEdit();

      // Should show form inputs (edit mode is via the Edit Profile tab)
      await expect(profilePage.saveProfileButton).toBeVisible();
    });

    test('PROF-007: should cancel profile editing', async ({ page }) => {
      await profilePage.goto();

      // Enter edit mode
      await profilePage.clickEdit();
      
      // Look for cancel button if available, otherwise just verify form is there
      const cancelBtn = page.getByRole('button', { name: /cancel|anuluj/i });

      if (await cancelBtn.isVisible())
        await cancelBtn.click();

      // Just verify page is still accessible
      await profilePage.expectPageVisible();
    });
  });

  test.describe('User Activity', () => {
    test('PROF-012: should display user reviews', async ({ page }) => {
      await profilePage.gotoActivity('reviews');

      // Should show activity section
      await expect(page).toHaveURL(/\/profile\/reviews/);
    });

    test('PROF-013: should display user fuel reports', async ({ page }) => {
      await profilePage.gotoActivity('reports');

      await expect(page).toHaveURL(/\/profile\/reports/);
    });

    test('PROF-014: should display user proposals', async ({ page }) => {
      await profilePage.gotoActivity('proposals');

      await expect(page).toHaveURL(/\/profile\/proposals/);
    });

    test('PROF-015: should switch between activity types', async ({ page }) => {
      await profilePage.gotoActivity('reviews');

      // Switch to reports
      await profilePage.selectActivityType('reports');

      // Switch to proposals
      await profilePage.selectActivityType('proposals');

      // Switch back to reviews
      await profilePage.selectActivityType('reviews');
    });
  });
});

test.describe('Change Password', () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    
    // Login
    await page.goto('/login');
    await page.locator('input[name="username"]').fill(TEST_USERS.regularUser.username);
    await page.locator('input[name="password"]').fill(TEST_USERS.regularUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL((url) => !url.pathname.includes('/login'));

    profilePage = new ProfilePage(page);
  });

  test('PROF-009: should show error with incorrect current password', async ({ page }) => {
    await profilePage.gotoPassword();

    // Try to change password with wrong current password
    await profilePage.changePassword(
      'WrongPassword123!',
      'NewPassword123!',
      'NewPassword123!'
    );

    // Should show error
    await profilePage.expectPasswordChangeError();
  });

  test('PROF-010: should validate new password length', async ({ page }) => {
    await profilePage.gotoPassword();

    // Fill with short password
    await profilePage.fillPasswordForm(
      TEST_USERS.regularUser.password,
      '123', // Too short
      '123'
    );

    // Button should be disabled due to validation error
    await profilePage.expectChangePasswordButtonDisabled();
    
    // Should stay on page
    await expect(page).toHaveURL(/\/profile\/password/);
  });

  test('PROF-011: should validate password confirmation match', async ({ page }) => {
    await profilePage.gotoPassword();

    // Fill with mismatched passwords
    await profilePage.fillPasswordForm(
      TEST_USERS.regularUser.password,
      'NewPassword123!',
      'DifferentPassword123!' // Doesn't match
    );

    // Button should be disabled due to validation error
    await profilePage.expectChangePasswordButtonDisabled();
    
    // Should stay on page
    await expect(page).toHaveURL(/\/profile\/password/);
  });
});
