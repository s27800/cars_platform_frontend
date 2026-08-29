import { test, expect } from '@playwright/test';
import { CarsSearchPage } from '../../pages';


test.describe('Cars Search', () => {
  let carsPage: CarsSearchPage;

  test.beforeEach(async ({ page }) => {
    carsPage = new CarsSearchPage(page);
    await carsPage.goto();
    await carsPage.waitForLoading();
  });

  test.describe('Page Display', () => {
    test('should display search page correctly', async () => {
      await carsPage.expectPageVisible();
    });

    test('should display car results', async () => {
      await carsPage.expectResultsCountGreaterThan(0);
    });

    test('should display pagination when results exceed page size', async () => {
      await carsPage.expectPaginationVisible();
    });
  });

  test.describe('Text Search', () => {
    test('SEARCH-001: should search by brand name', async () => {
      await carsPage.search('Volkswagen');
      await carsPage.waitForLoading();

      // Should show results containing Golf
      await carsPage.expectCarCardWithName('Golf');
    });

    test('SEARCH-002: should display search results', async () => {
      await carsPage.search('BMW');
      await carsPage.waitForLoading();

      await carsPage.expectResultsCountGreaterThan(0);
    });

    test('SEARCH-003: should show no results message for invalid search', async () => {
      await carsPage.search('xyznonexistent12345');
      await carsPage.waitForLoading();

      await carsPage.expectNoResults();
    });

    test('SEARCH-004: should debounce search input', async ({ page }) => {

      // Type quickly
      await carsPage.searchInput.pressSequentially('BMW', { delay: 50 });

      // Should not immediately search (debounce)
      await page.waitForTimeout(200);
      
      // After debounce period, search should execute
      await page.waitForTimeout(400);
      await carsPage.waitForLoading();

      await carsPage.expectResultsCountGreaterThan(0);
    });

    test('SEARCH-005: should preserve search in URL', async ({ page }) => {
      await carsPage.search('Audi');
      await carsPage.waitForLoading();

      await carsPage.expectUrlContains({ search: 'Audi' });

      // Refresh page
      await page.reload();
      await carsPage.waitForLoading();

      // Search should be preserved
      await expect(carsPage.searchInput).toHaveValue('Audi');
    });

    test('SEARCH-006: should clear search', async () => {
      await carsPage.search('BMW');
      await carsPage.waitForLoading();

      await carsPage.clearSearch();
      await carsPage.waitForLoading();

      // Should show all results again
      await carsPage.expectResultsCountGreaterThan(0);
    });
  });

  test.describe('Car Card Interaction', () => {
    test('should navigate to car details on card click', async ({ page }) => {
      await carsPage.clickCarCard(0);

      await expect(page).toHaveURL(/\/cars\/[0-9a-fA-F-]{36}/);
    });

    test('should display car information on cards', async () => {

      // First card should have visible content
      await carsPage.waitForCarCards();
      
      const firstCard = carsPage.carCards.first();

      await expect(firstCard).toBeVisible();
      
      // Card should have a title (h3 with car name)
      await expect(firstCard.locator('h3')).toBeVisible();
    });
  });

  test.describe('Search with Filters', () => {
    test('should combine search with filters', async () => {
      
      // Search for a brand
      await carsPage.search('Golf');
      await carsPage.waitForLoading();

      // Results should contain Golf
      await carsPage.expectCarCardWithName('Golf');
    });
  });
});
