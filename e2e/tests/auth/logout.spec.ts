import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages';
import { TEST_USERS } from '../../fixtures';

test.describe('Logout', () => {
  
  // Helper to find user menu button
  const clickUserMenu = async (page) => {

    // Wait for page to fully load - find user menu button by aria-haspopup attribute
    const userMenu = page.locator('button[aria-haspopup="true"]').first();
    await userMenu.waitFor({ state: 'visible', timeout: 10000 });
    await userMenu.click();
  };

  // Helper to find and click logout button in dropdown
  const clickLogout = async (page) => {
    const logoutButton = page.locator('button:has-text("Sign out"), button:has-text("Wyloguj")').first();
    await logoutButton.click();
  };

  test.beforeEach(async ({ page }) => {

    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      TEST_USERS.regularUser.username,
      TEST_USERS.regularUser.password
    );
    await loginPage.expectLoginSuccess();
  });

  test('LOGOUT-001: should logout successfully', async ({ page }) => {

    // Open user menu
    await clickUserMenu(page);

    // Click logout
    await clickLogout(page);

    // Verify logout - should be redirected
    await expect(page).toHaveURL('/');
  });

  test('LOGOUT-002: should remove token from localStorage', async ({ page }) => {

    // Verify token exists before logout
    const tokenBefore = await page.evaluate(() => localStorage.getItem('token'));
    expect(tokenBefore).toBeTruthy();

    // Perform logout
    await clickUserMenu(page);
    await clickLogout(page);

    // Wait for logout to complete
    await page.waitForTimeout(500);

    // Verify token is removed
    const tokenAfter = await page.evaluate(() => localStorage.getItem('token'));
    expect(tokenAfter).toBeNull();
  });

  test('LOGOUT-003: should redirect to home page after logout', async ({ page }) => {
    
    // Navigate to profile page first
    await page.goto('/profile');
    
    // Perform logout
    await clickUserMenu(page);
    await clickLogout(page);

    // When logging out from protected page, redirect to home or login
    await expect(page).toHaveURL(/\/(login)?$/);
  });

  test('LOGOUT-004: should not have access to protected pages after logout', async ({ page }) => {

    // Perform logout
    await clickUserMenu(page);
    await clickLogout(page);

    // Wait for logout
    await page.waitForURL('/');

    // Try to access protected page
    await page.goto('/profile');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show login button in header after logout', async ({ page, isMobile }) => {
    
    // Skip on mobile - sign in button is in hamburger menu
    test.skip(isMobile, 'Sign in button is in hamburger menu on mobile');
    
    // Perform logout
    await clickUserMenu(page);
    await clickLogout(page);

    // Wait for logout
    await page.waitForURL('/');

    // Should see Sign in link in header
    await expect(page.getByText('Sign in')).toBeVisible();
  });
});
