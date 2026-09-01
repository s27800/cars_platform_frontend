import { test, expect, type Page } from '@playwright/test';
import { LoginPage, HomePage } from '../../pages';
import { TEST_USERS } from '../../fixtures';


test.describe('Logout', () => {
  const userMenuTrigger = (page: Page) => page.locator('button[aria-haspopup="true"]');

  const clickUserMenu = async (page: Page) => {
    const trigger = userMenuTrigger(page);

    await expect(trigger).toBeVisible();

    if (await trigger.getAttribute('aria-expanded') !== 'true')
      await trigger.click();

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  };

  const clickLogout = async (page: Page) => {
    await clickUserMenu(page);

    const logoutButton = page.getByRole('button', { name: /^(Sign out|Wyloguj się)$/ });

    await expect(logoutButton).toBeVisible();
    await logoutButton.click();
  };

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      TEST_USERS.regularUser.username,
      TEST_USERS.regularUser.password
    );

    await loginPage.expectLoginSuccess();
  });

  test('should logout successfully', async ({ page }) => {
    await clickLogout(page);
    await expect(page).toHaveURL('/');
  });

  test('should remove token from localStorage', async ({ page }) => {
    const tokenBefore = await page.evaluate(() => localStorage.getItem('token'));
    expect(tokenBefore).toBeTruthy();

    await clickLogout(page);

    await expect(page).toHaveURL('/');

    const tokenAfter = await page.evaluate(() => localStorage.getItem('token'));
    expect(tokenAfter).toBeNull();
  });

  test('should redirect to home page after logout', async ({ page }) => {
    await page.goto('/profile');

    await clickLogout(page);

    await expect(page).toHaveURL(/\/(login)?$/);
  });

  test('should not have access to protected pages after logout', async ({ page }) => {
    await clickLogout(page);

    await page.waitForURL('/');

    await page.goto('/profile');

    await expect(page).toHaveURL(/\/login/);
  });

  test('should show login button in header after logout', async ({ page, isMobile }) => {
    await clickLogout(page);

    await page.waitForURL('/');

    const homePage = new HomePage(page);

    if (isMobile)
      await homePage.openHamburgerMenuIfMobile();

    const container = isMobile
      ? page.locator('#mobile-menu')
      : page.locator('nav[aria-label="Main navigation"]');

    await expect(container.getByText(/Sign in|Zaloguj/i).first()).toBeVisible();
  });
});
