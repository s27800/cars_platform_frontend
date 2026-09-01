import { test, expect } from '@playwright/test';
import { test as authTest } from '../../fixtures/auth.fixture';
import { ProfilePage } from '../../pages';
import { TEST_USERS } from '../../fixtures';


test.describe('Profile Page - Unauthenticated', () => {
  test('should redirect unauthenticated user to login', async ({ page }) => {

    await page.goto('/');

    await page.evaluate(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });

    await page.goto('/profile');

    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Profile Page - Authenticated', () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {

    await page.goto('/login');
    await page.locator('input[name="username"]').fill(TEST_USERS.regularUser.username);
    await page.locator('input[name="password"]').fill(TEST_USERS.regularUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL((url) => !url.pathname.includes('/login'));

    profilePage = new ProfilePage(page);
  });

  test.describe('View Profile', () => {
    test('should display profile information', async () => {
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
    test('should navigate between profile tabs', async ({ page }) => {
      await profilePage.goto();

      await profilePage.clickPasswordTab();

      await expect(profilePage.passwordTab).toBeVisible();

      await profilePage.clickProfileTab();
      await expect(profilePage.profileTab).toBeVisible();
    });
  });

  test.describe('Edit Profile', () => {
    test('should allow editing profile', async () => {
      await profilePage.goto();

      await profilePage.clickEdit();

      await expect(profilePage.saveProfileButton).toBeVisible();
    });

    test('should cancel profile editing', async ({ page }) => {
      await profilePage.goto();

      await profilePage.clickEdit();
      
      const cancelBtn = page.getByRole('button', { name: /cancel|anuluj/i });

      if (await cancelBtn.isVisible())
        await cancelBtn.click();

      await profilePage.expectPageVisible();
    });
  });

  test.describe('User Activity', () => {
    test('should display user reviews', async ({ page }) => {
      await profilePage.gotoActivity('reviews');

      await expect(page).toHaveURL(/\/profile\/reviews/);
    });

    test('should display user fuel reports', async ({ page }) => {
      await profilePage.gotoActivity('reports');

      await expect(page).toHaveURL(/\/profile\/reports/);
    });

    test('should display user proposals', async ({ page }) => {
      await profilePage.gotoActivity('proposals');

      await expect(page).toHaveURL(/\/profile\/proposals/);
    });

    test('should switch between activity types', async ({ page }) => {
      await profilePage.gotoActivity('reviews');

      await profilePage.selectActivityType('reports');

      await profilePage.selectActivityType('proposals');

      await profilePage.selectActivityType('reviews');
    });
  });
});

test.describe('Change Password', () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    
    await page.goto('/login');
    await page.locator('input[name="username"]').fill(TEST_USERS.regularUser.username);
    await page.locator('input[name="password"]').fill(TEST_USERS.regularUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL((url) => !url.pathname.includes('/login'));

    profilePage = new ProfilePage(page);
  });

  test('should show error with incorrect current password', async ({ page }) => {
    await profilePage.gotoPassword();

    await profilePage.changePassword(
      'WrongPassword123!',
      'NewPassword123!',
      'NewPassword123!'
    );

    await profilePage.expectPasswordChangeError();
  });

  test('should validate new password length', async ({ page }) => {
    await profilePage.gotoPassword();

    await profilePage.fillPasswordForm(
      TEST_USERS.regularUser.password,
      '123', // Too short
      '123'
    );

    await profilePage.expectChangePasswordButtonDisabled();
    
    await expect(page).toHaveURL(/\/profile\/password/);
  });

  test('should validate password confirmation match', async ({ page }) => {
    await profilePage.gotoPassword();

    await profilePage.fillPasswordForm(
      TEST_USERS.regularUser.password,
      'NewPassword123!',
      'DifferentPassword123!' // Doesn't match
    );

    await profilePage.expectChangePasswordButtonDisabled();
    
    await expect(page).toHaveURL(/\/profile\/password/);
  });
});
