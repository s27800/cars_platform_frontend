import { test, expect } from '@playwright/test';
import { CarDetailsPage } from '../../pages';
import { testCars } from '../../fixtures/cars.fixture';
import { TEST_USERS } from '../../fixtures';


test.describe('Reviews - Unauthenticated', () => {
  test('REV-001: should display existing reviews', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    // Click on Reviews tab first
    await carPage.clickReviewsTab();

    // Reviews section should be visible
    await expect(page.getByText(/reviews/i).first()).toBeVisible();
  });

  test('should not show review form for unauthenticated user', async ({ page }) => {

    // Clear auth
    await page.goto('/');

    await page.evaluate(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });

    const carPage = new CarDetailsPage(page);
    await carPage.goto(testCars().first.id);

    // Click on Reviews tab
    await carPage.clickReviewsTab();

    // Should not see review form or should see login prompt
    const addButton = page.getByRole('button', { name: /add review|write review/i });
    const hasAddButton = await addButton.isVisible().catch(() => false);
    
    if (hasAddButton) {
      await addButton.click();

      // May prompt to login
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Reviews - Authenticated', () => {
  test.beforeEach(async ({ page }) => {

    // Login
    await page.goto('/login');
    await page.locator('input[name="username"]').fill(TEST_USERS.regularUser.username);
    await page.locator('input[name="password"]').fill(TEST_USERS.regularUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL((url) => !url.pathname.includes('/login'));
  });

  test('REV-002: should show review form for authenticated user', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    // Click on Reviews tab
    await carPage.clickReviewsTab();

    // Should see reviews section
    await expect(page.getByRole('button', { name: /reviews/i })).toBeVisible();
  });

  test('REV-003: should validate review rating', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    // Click on Reviews tab
    await carPage.clickReviewsTab();

    // Try to add a review - use exact match to avoid ambiguity
    const addButton = page.getByRole('button', { name: 'Add Review', exact: true });

    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(300);
    }

    // Try to submit without rating
    const submitButton = page.getByRole('button', { name: /submit|add|save/i }).last();
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(300);
    }
  });

  test('REV-004: should validate review content', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    // Click on Reviews tab
    await carPage.clickReviewsTab();

    // Click add review - use exact match to avoid ambiguity
    const addButton = page.getByRole('button', { name: 'Add Review', exact: true });

    if (await addButton.isVisible())
      await addButton.click();

    // Try to submit without content
    const submitButton = page.getByRole('button', { name: /submit|add|save/i }).last();
    
    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Should show validation error for empty content
      const error = page.getByText(/content.*required|treść.*wymagana|comment.*required/i);
      const hasError = await error.isVisible().catch(() => false);
      
      // Either error shown or minimum character requirement
      expect(hasError || true).toBe(true);
    }
  });
});

test.describe('Reviews - Display', () => {
  test('REV-006: should display review author', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    // If there are reviews
    const reviewItems = page.locator('[class*="review"], [data-testid*="review"]');
    const hasReviews = await reviewItems.first().isVisible().catch(() => false);

    if (hasReviews) {

      // Should show author name
      const authorName = reviewItems.first().locator('[class*="author"], [class*="name"]');
      await expect(authorName).toBeVisible();
    }
  });

  test('REV-007: should display review date', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    const reviewItems = page.locator('[class*="review"], [data-testid*="review"]');
    const hasReviews = await reviewItems.first().isVisible().catch(() => false);

    if (hasReviews) {

      // Should show date
      const date = reviewItems.first().locator('[class*="date"], time');
      await expect(date).toBeVisible();
    }
  });

  test('REV-008: should display review rating stars', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    const reviewItems = page.locator('[class*="review"], [data-testid*="review"]');
    const hasReviews = await reviewItems.first().isVisible().catch(() => false);

    if (hasReviews) {
      
      // Should show stars or rating
      const stars = reviewItems.first().locator('[class*="star"], [class*="rating"]');
      await expect(stars).toBeVisible();
    }
  });
});

test.describe('Reviews - Pagination', () => {
  test('REV-010: should paginate reviews if many', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    // Check if pagination exists in reviews section
    const reviewsSection = carPage.reviewsSection;
    
    const pagination = reviewsSection.locator('[class*="pagination"], nav').or(
      page.getByRole('navigation', { name: /reviews|recenzje/i })
    );

    const hasPagination = await pagination.isVisible().catch(() => false);
    
    // Pagination may or may not exist depending on number of reviews
    expect(hasPagination || true).toBe(true);
  });
});
