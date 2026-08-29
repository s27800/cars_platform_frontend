import { test, expect } from '@playwright/test';
import { LoginPage, HomePage } from '../../pages';
import { TEST_USERS } from '../../fixtures';


test.describe('Logout', () => {
  
  // Helper to find user menu button
  const clickUserMenu = async (page) => {

    // Wait for page to fully load - find user menu button by aria-haspopup attribute
    const userMenu = page.locator('button[aria-haspopup="true"]').first();

    await userMenu.waitFor({ state: 'visible', timeout: 10000 });
    await userMenu.click();
    
    // Wait for dropdown to appear
    await page.waitForTimeout(200);
  };

  // Helper to find and click logout button in dropdown
  const clickLogout = async (page) => {

    // Retry logic for opening menu and clicking logout
    for (let attempt = 0; attempt < 3; attempt++) {

      // Wait for dropdown menu to be visible
      const dropdownMenu = page.locator('[role="menu"], .absolute.right-0, div[class*="absolute"][class*="right"]');
      const isDropdownVisible = await dropdownMenu.first().isVisible().catch(() => false);
      
      if (!isDropdownVisible) {

        // Re-click user menu if dropdown closed
        const userMenu = page.locator('button[aria-haspopup="true"]').first();
        await userMenu.click();
        await page.waitForTimeout(300);
      }
      
      const logoutButton = page.locator('button:has-text("Sign out"), button:has-text("Wyloguj")').first();
      const isLogoutVisible = await logoutButton.isVisible().catch(() => false);
      
      if (isLogoutVisible) {
        await logoutButton.click();
        return;
      }
      
      await page.waitForTimeout(200);
    }
    
    // Final attempt
    const logoutButton = page.locator('button:has-text("Sign out"), button:has-text("Wyloguj")').first();
    await logoutButton.waitFor({ state: 'visible', timeout: 5000 });
    await logoutButton.click();
  };

  // Login first
  test.beforeEach(async ({ page }) => {
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
    
    // Perform logout
    await clickUserMenu(page);
    await clickLogout(page);

    // Wait for logout
    await page.waitForURL('/');

    // Open hamburger menu on mobile to see auth links
    const homePage = new HomePage(page);

    if (isMobile) 
      await homePage.openHamburgerMenuIfMobile();

    // Should see Sign in link in header or mobile menu
    const container = isMobile 
      ? page.locator('#mobile-menu')
      : page.locator('nav[aria-label="Main navigation"]');

    await expect(container.getByText(/Sign in|Zaloguj/i).first()).toBeVisible();
  });
});
