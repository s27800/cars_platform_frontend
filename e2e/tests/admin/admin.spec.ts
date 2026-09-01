import { test, expect } from '@playwright/test';
import { AdminDashboardPage } from '../../pages';
import { TEST_USERS } from '../../fixtures';


test.describe('Admin Dashboard - Unauthorized Access', () => {
  test('should redirect non-admin user', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[name="username"]').fill(TEST_USERS.regularUser.username);
    await page.locator('input[name="password"]').fill(TEST_USERS.regularUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL((url) => !url.pathname.includes('/login'));

    await page.goto('/admin');

    await expect(page).not.toHaveURL(/\/admin$/);
  });

  test('should redirect unauthenticated user', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });

    await page.goto('/admin');

    await expect(page).not.toHaveURL(/\/admin$/);
  });
});

test.describe('Admin Dashboard - Authorized Access', () => {
  let adminPage: AdminDashboardPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[name="username"]').fill(TEST_USERS.admin.username);
    await page.locator('input[name="password"]').fill(TEST_USERS.admin.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL((url) => !url.pathname.includes('/login'));

    adminPage = new AdminDashboardPage(page);
  });

  test.describe('Dashboard Display', () => {
    test('should allow admin access', async ({ page }) => {
      await adminPage.goto();

      await expect(page).toHaveURL(/\/admin/);
      await adminPage.expectDashboardVisible();
    });

    test('should display statistics cards', async () => {
      await adminPage.goto();

      await expect(adminPage.statsCards.first()).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to reviews moderation', async ({ page }) => {
      await adminPage.goto();

      await adminPage.reviewsLink.scrollIntoViewIfNeeded();
      await adminPage.clickReviewsLink();

      await expect(page).toHaveURL(/\/admin\/reviews/);
    });

    test('should navigate to fuel reports moderation', async ({ page }) => {
      await adminPage.goto();

      await adminPage.fuelReportsLink.scrollIntoViewIfNeeded();
      await adminPage.clickFuelReportsLink();

      await expect(page).toHaveURL(/\/admin\/fuel-reports/);
    });

    test('should navigate to proposals management', async ({ page }) => {
      await adminPage.goto();

      await adminPage.proposalsLink.scrollIntoViewIfNeeded();
      await adminPage.clickProposalsLink();

      await expect(page).toHaveURL(/\/admin\/proposals/);
    });
  });
});

test.describe('Admin Reviews Moderation', () => {
  let adminPage: AdminDashboardPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[name="username"]').fill(TEST_USERS.admin.username);
    await page.locator('input[name="password"]').fill(TEST_USERS.admin.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL((url) => !url.pathname.includes('/login'));

    adminPage = new AdminDashboardPage(page);
  });

  test('should display pending reviews list', async () => {
    await adminPage.gotoReviews();
    await adminPage.expectReviewsListVisible();
  });

  test('should display approve and reject buttons', async () => {
    await adminPage.gotoReviews();

    const hasReviews = await adminPage.reviewItems.first().isVisible().catch(() => false);
    
    if (hasReviews) {
      await expect(adminPage.approveButtons.first()).toBeVisible();
      await expect(adminPage.rejectButtons.first()).toBeVisible();
    }
  });
});

test.describe('Admin Fuel Reports Moderation', () => {
  let adminPage: AdminDashboardPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[name="username"]').fill(TEST_USERS.admin.username);
    await page.locator('input[name="password"]').fill(TEST_USERS.admin.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL((url) => !url.pathname.includes('/login'));

    adminPage = new AdminDashboardPage(page);
  });

  test('ADMIN-009: should display pending fuel reports', async () => {
    await adminPage.gotoFuelReports();
    await adminPage.expectFuelReportsListVisible();
  });
});

test.describe('Admin Proposals Management', () => {
  let adminPage: AdminDashboardPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[name="username"]').fill(TEST_USERS.admin.username);
    await page.locator('input[name="password"]').fill(TEST_USERS.admin.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL((url) => !url.pathname.includes('/login'));

    adminPage = new AdminDashboardPage(page);
  });

  test('should display data proposals list', async () => {
    await adminPage.gotoProposals();
    await adminPage.expectProposalsListVisible();
  });
});
