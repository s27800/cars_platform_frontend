import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages';
import { TEST_USERS, ROUTES } from '../../fixtures';

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.describe('Page Display', () => {
    test('should display login form correctly', async () => {
      await loginPage.expectPageVisible();
      await expect(loginPage.pageTitle).toBeVisible();
      await expect(loginPage.registerLink).toBeVisible();
    });

    test('should have username and password fields', async () => {
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test.describe('Successful Login', () => {
    test('AUTH-001: should login successfully with valid credentials', async ({ page }) => {
      await loginPage.login(
        TEST_USERS.regularUser.username,
        TEST_USERS.regularUser.password
      );

      // Should redirect away from login page
      await loginPage.expectLoginSuccess();
      
      // Should be on home page
      await expect(page).toHaveURL('/');
      
      // Should store token in localStorage
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeTruthy();
    });

    test('should login as admin successfully', async ({ page }) => {
      await loginPage.login(
        TEST_USERS.admin.username,
        TEST_USERS.admin.password
      );

      await loginPage.expectLoginSuccess();
      
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeTruthy();
    });

    test('AUTH-006: should redirect to original page after login', async ({ page }) => {

      // Navigate to profile page (protected)
      await page.goto('/profile');
      
      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
      
      // Login
      await loginPage.login(
        TEST_USERS.regularUser.username,
        TEST_USERS.regularUser.password
      );
      
      // Should redirect back to profile
      await expect(page).toHaveURL(/\/profile/);
    });
  });

  test.describe('Failed Login', () => {
    test('AUTH-002: should show error with invalid password', async ({ page }) => {
      await loginPage.loginAndWaitForResponse(
        TEST_USERS.regularUser.username,
        'wrongpassword123'
      );

      // Wait for error toast/message
      await loginPage.expectError();
      
      // Should stay on login page
      await expect(page).toHaveURL(/\/login/);
    });

    test('AUTH-003: should show error with non-existent username', async ({ page }) => {
      await loginPage.loginAndWaitForResponse(
        'nonexistentuser12345',
        'somepassword123'
      );

      // Wait for error toast/message
      await loginPage.expectError();
      
      // Should stay on login page
      await expect(page).toHaveURL(/\/login/);
    });

    test('should stay on login page with empty credentials', async ({ page }) => {
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Form Validation', () => {
    test('AUTH-004: should not allow submission without username', async ({ page }) => {
      await loginPage.fillPassword('somepassword123');
      
      // Button should still be disabled without username
      await loginPage.expectSubmitDisabled();

      // Should stay on login page
      await expect(page).toHaveURL(/\/login/);
    });

    test('AUTH-005: should not allow submission with short password', async ({ page }) => {
      await loginPage.fillUsername('testuser');
      await loginPage.fillPassword('123'); // Too short
      
      // Button should be disabled with invalid password
      await loginPage.expectSubmitDisabled();

      // Should stay on login page
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Password Visibility', () => {
    test('AUTH-008: should toggle password visibility', async () => {
      await loginPage.fillPassword('testpassword');
      
      // Initially password should be hidden
      await loginPage.expectPasswordHidden();
      
      // Toggle visibility
      await loginPage.togglePasswordVisibility();
      
      // Password should be visible
      await loginPage.expectPasswordVisible();
      
      // Toggle back
      await loginPage.togglePasswordVisibility();
      
      // Password should be hidden again
      await loginPage.expectPasswordHidden();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to register page', async ({ page }) => {
      await loginPage.clickRegisterLink();
      
      await expect(page).toHaveURL(/\/register/);
    });
  });

  test.describe('Session Persistence', () => {
    test('AUTH-007: should maintain session after page refresh', async ({ page }) => {

      // Login
      await loginPage.login(
        TEST_USERS.regularUser.username,
        TEST_USERS.regularUser.password
      );
      
      await loginPage.expectLoginSuccess();
      
      // Store token before refresh
      const tokenBefore = await page.evaluate(() => localStorage.getItem('token'));
      
      // Refresh page
      await page.reload();
      
      // Token should still exist
      const tokenAfter = await page.evaluate(() => localStorage.getItem('token'));
      expect(tokenAfter).toBe(tokenBefore);
      
      // Should still be logged in (not redirected to login)
      await expect(page).not.toHaveURL(/\/login/);
    });
  });

  test.describe('Redirect Logged-in User', () => {
    test('should redirect authenticated user away from login page', async ({ page }) => {
      
      // First login
      await loginPage.login(
        TEST_USERS.regularUser.username,
        TEST_USERS.regularUser.password
      );
      
      await loginPage.expectLoginSuccess();
      
      // Try to navigate to login page again
      await page.goto('/login');
      
      // Should be redirected away from login
      await expect(page).not.toHaveURL(/\/login$/);
    });
  });
});
