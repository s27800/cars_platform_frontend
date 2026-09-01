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
    test('should login successfully with valid credentials', async ({ page }) => {
      await loginPage.login(
        TEST_USERS.regularUser.username,
        TEST_USERS.regularUser.password
      );

      await loginPage.expectLoginSuccess();
      
      await expect(page).toHaveURL('/');
      
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

    test('should redirect to original page after login', async ({ page }) => {
      await page.goto('/profile');
      
      await expect(page).toHaveURL(/\/login/);
      
      await loginPage.login(
        TEST_USERS.regularUser.username,
        TEST_USERS.regularUser.password
      );
      
      await expect(page).toHaveURL(/\/profile/);
    });
  });

  test.describe('Failed Login', () => {
    test('should show error with invalid password', async ({ page }) => {
      await loginPage.loginAndWaitForResponse(
        TEST_USERS.regularUser.username,
        'wrongpassword123'
      );

      await loginPage.expectError();
      
      await expect(page).toHaveURL(/\/login/);
    });

    test('should show error with non-existent username', async ({ page }) => {
      await loginPage.loginAndWaitForResponse(
        'nonexistentuser12345',
        'somepassword123'
      );

      await loginPage.expectError();
      
      await expect(page).toHaveURL(/\/login/);
    });

    test('should stay on login page with empty credentials', async ({ page }) => {
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Form Validation', () => {
    test('should not allow submission without username', async ({ page }) => {
      await loginPage.fillPassword('somepassword123');
      
      await loginPage.expectSubmitDisabled();

      await expect(page).toHaveURL(/\/login/);
    });

    test('should not allow submission with short password', async ({ page }) => {
      await loginPage.fillUsername('testuser');
      await loginPage.fillPassword('123'); // Too short
      
      await loginPage.expectSubmitDisabled();

      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Password Visibility', () => {
    test('should toggle password visibility', async () => {
      await loginPage.fillPassword('testpassword');
      
      await loginPage.expectPasswordHidden();
      
      await loginPage.togglePasswordVisibility();
      
      await loginPage.expectPasswordVisible();
      
      await loginPage.togglePasswordVisibility();
      
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
    test('should maintain session after page refresh', async ({ page }) => {
      await loginPage.login(
        TEST_USERS.regularUser.username,
        TEST_USERS.regularUser.password
      );
      
      await loginPage.expectLoginSuccess();
      
      const tokenBefore = await page.evaluate(() => localStorage.getItem('token'));
      
      await page.reload();
      
      const tokenAfter = await page.evaluate(() => localStorage.getItem('token'));
      expect(tokenAfter).toBe(tokenBefore);
      
      await expect(page).not.toHaveURL(/\/login/);
    });
  });

  test.describe('Redirect Logged-in User', () => {
    test('should redirect authenticated user away from login page', async ({ page }) => {
      await loginPage.login(
        TEST_USERS.regularUser.username,
        TEST_USERS.regularUser.password
      );
      
      await loginPage.expectLoginSuccess();
      
      await page.goto('/login');
      
      await expect(page).not.toHaveURL(/\/login$/);
    });
  });
});
