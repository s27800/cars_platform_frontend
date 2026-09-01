import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages';
import { TEST_USERS, generateNewUser, ROUTES } from '../../fixtures';


test.describe('Register Page', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test.describe('Page Display', () => {
    test('should display registration form correctly', async () => {
      await registerPage.expectPageVisible();
      await expect(registerPage.pageTitle).toBeVisible();
      await expect(registerPage.loginLink).toBeVisible();
    });

    test('should have all required fields', async () => {
      await expect(registerPage.usernameInput).toBeVisible();
      await expect(registerPage.emailInput).toBeVisible();
      await expect(registerPage.passwordInput).toBeVisible();
      await expect(registerPage.confirmPasswordInput).toBeVisible();
      await expect(registerPage.firstNameInput).toBeVisible();
      await expect(registerPage.lastNameInput).toBeVisible();
      await expect(registerPage.submitButton).toBeVisible();
    });
  });

  test.describe('Successful Registration', () => {
    test('should register new user successfully', async ({ page }) => {
      const newUser = generateNewUser();

      await registerPage.register(newUser);

      await registerPage.expectRegistrationSuccess();
      
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeTruthy();
    });
  });

  test.describe('Failed Registration', () => {
    test('should show error with existing username', async () => {
      const existingUser = {
        username: TEST_USERS.regularUser.username, // Already exists
        email: `newemail_${Date.now()}@test.com`,
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
      };

      await registerPage.register(existingUser);

      await registerPage.expectError();
      
      await expect(registerPage.page).toHaveURL(/\/register/);
    });

    test('should show error with existing email', async () => {
      const shortId = String(Date.now()).slice(-8);
      const userWithExistingEmail = {
        username: `user_${shortId}`, // Short enough for 20 char limit
        email: TEST_USERS.regularUser.email, // Already exists
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
      };

      await registerPage.register(userWithExistingEmail);

      await registerPage.expectError();
    });
  });

  test.describe('Form Validation', () => {
    test('should show validation errors when submitting empty form', async () => {
      await registerPage.forceClickSubmit();
      await expect(registerPage.page).toHaveURL(/\/register/);
    });

    test('should keep submit button disabled when passwords do not match', async () => {
      const shortId = String(Date.now()).slice(-8);
      const userData = {
        username: `user_${shortId}`,
        email: `test_${shortId}@test.com`,
        password: 'TestPassword123!',
        confirmPassword: 'DifferentPassword123!', // Doesn't match
        firstName: 'Test',
        lastName: 'User',
      };

      await registerPage.fillRegistrationForm(userData);
      
      await registerPage.expectSubmitDisabled();
      
      await expect(registerPage.page).toHaveURL(/\/register/);
    });

    test('should keep submit button disabled with invalid email', async () => {
      const shortId = String(Date.now()).slice(-8);
      const userData = {
        username: `user_${shortId}`,
        email: 'invalid-email-format', // Invalid email
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
      };

      await registerPage.fillRegistrationForm(userData);
      
      await registerPage.expectSubmitDisabled();
      
      await expect(registerPage.page).toHaveURL(/\/register/);
    });

    test('should keep submit button disabled with invalid username pattern', async () => {
      const userData = {
        username: 'user with spaces', // Invalid characters
        email: `test_${Date.now()}@test.com`,
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
      };

      await registerPage.fillRegistrationForm(userData);
      
      await registerPage.expectSubmitDisabled();
      
      await expect(registerPage.page).toHaveURL(/\/register/);
    });

    test('should keep submit button disabled with short password', async () => {
      const shortId = String(Date.now()).slice(-8);
      const userData = {
        username: `user_${shortId}`,
        email: `test_${shortId}@test.com`,
        password: '123', // Too short
        confirmPassword: '123',
        firstName: 'Test',
        lastName: 'User',
      };

      await registerPage.fillRegistrationForm(userData);
      
      await registerPage.expectSubmitDisabled();
      
      await expect(registerPage.page).toHaveURL(/\/register/);
    });

    test('should keep submit button disabled with short username', async () => {
      const userData = {
        username: 'ab', // Too short
        email: `test_${Date.now()}@test.com`,
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
      };

      await registerPage.fillRegistrationForm(userData);
      
      await registerPage.expectSubmitDisabled();
      
      await expect(registerPage.page).toHaveURL(/\/register/);
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to login page', async ({ page }) => {
      await registerPage.clickLoginLink();
      
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Redirect Logged-in User', () => {
    test('should redirect authenticated user away from register page', async ({ page }) => {
      await page.goto('/login');
      await page.locator('input[name="username"]').fill(TEST_USERS.regularUser.username);
      await page.locator('input[name="password"]').fill(TEST_USERS.regularUser.password);
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await page.waitForURL((url) => !url.pathname.includes('/login'));
      
      await page.goto('/register');
      
      await expect(page).not.toHaveURL(/\/register$/);
    });
  });
});
