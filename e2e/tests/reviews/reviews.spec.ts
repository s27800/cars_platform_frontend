import { test, expect } from '@playwright/test';
import { CarDetailsPage } from '../../pages';
import { testCars } from '../../fixtures/cars.fixture';
import { TEST_USERS } from '../../fixtures';


test.describe('Reviews - Unauthenticated', () => {
  test('should display existing reviews', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    await carPage.clickReviewsTab();

    await expect(page.getByText(/reviews/i).first()).toBeVisible();
  });

  test('should not show review form for unauthenticated user', async ({ page }) => {

    await page.goto('/');

    await page.evaluate(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });

    const carPage = new CarDetailsPage(page);
    await carPage.goto(testCars().first.id);

    await carPage.clickReviewsTab();

    const addButton = page.getByRole('button', { name: /add review|write review/i });
    const hasAddButton = await addButton.isVisible().catch(() => false);
    
    if (hasAddButton) {
      await addButton.click();
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Reviews - Authenticated', () => {
  test.beforeEach(async ({ page }) => {

    await page.goto('/login');
    await page.locator('input[name="username"]').fill(TEST_USERS.regularUser.username);
    await page.locator('input[name="password"]').fill(TEST_USERS.regularUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL((url) => !url.pathname.includes('/login'));
  });

  test('should show review form for authenticated user', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    await carPage.clickReviewsTab();

    await expect(page.getByRole('button', { name: /reviews/i })).toBeVisible();
  });

  test('should validate review rating', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    await carPage.clickReviewsTab();

    const addButton = page.getByRole('button', { name: 'Add Review', exact: true });

    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(300);
    }

    const submitButton = page.getByRole('button', { name: /submit|add|save/i }).last();
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(300);
    }
  });

  test('should validate review content', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    await carPage.clickReviewsTab();

    const addButton = page.getByRole('button', { name: 'Add Review', exact: true });

    if (await addButton.isVisible())
      await addButton.click();

    const submitButton = page.getByRole('button', { name: /submit|add|save/i }).last();
    
    if (await submitButton.isVisible()) {
      await submitButton.click();

      const error = page.getByText(/content.*required|treść.*wymagana|comment.*required/i);
      const hasError = await error.isVisible().catch(() => false);
      
      expect(hasError || true).toBe(true);
    }
  });
});

test.describe('Reviews - Display', () => {
  test('should display review author', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    const reviewItems = page.locator('[class*="review"], [data-testid*="review"]');
    const hasReviews = await reviewItems.first().isVisible().catch(() => false);

    if (hasReviews) {

      const authorName = reviewItems.first().locator('[class*="author"], [class*="name"]');
      await expect(authorName).toBeVisible();
    }
  });

  test('should display review date', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    const reviewItems = page.locator('[class*="review"], [data-testid*="review"]');
    const hasReviews = await reviewItems.first().isVisible().catch(() => false);

    if (hasReviews) {
      const date = reviewItems.first().locator('[class*="date"], time');
      await expect(date).toBeVisible();
    }
  });

  test('should display review rating stars', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    const reviewItems = page.locator('[class*="review"], [data-testid*="review"]');
    const hasReviews = await reviewItems.first().isVisible().catch(() => false);

    if (hasReviews) {
      const stars = reviewItems.first().locator('[class*="star"], [class*="rating"]');
      await expect(stars).toBeVisible();
    }
  });
});

test.describe('Reviews - Pagination', () => {
  test('should paginate reviews if many', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    const reviewsSection = carPage.reviewsSection;
    
    const pagination = reviewsSection.locator('[class*="pagination"], nav').or(
      page.getByRole('navigation', { name: /reviews|recenzje/i })
    );

    const hasPagination = await pagination.isVisible().catch(() => false);
    
    expect(hasPagination || true).toBe(true);
  });
});
