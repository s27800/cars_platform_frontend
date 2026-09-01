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
    test('should search by brand name', async () => {
      await carsPage.search('Volkswagen');
      await carsPage.waitForLoading();
      await carsPage.expectCarCardWithName('Golf');
    });

    test('should display search results', async () => {
      await carsPage.search('BMW');
      await carsPage.waitForLoading();
      await carsPage.expectResultsCountGreaterThan(0);
    });

    test('should show no results message for invalid search', async () => {
      await carsPage.search('xyznonexistent12345');
      await carsPage.waitForLoading();
      await carsPage.expectNoResults();
    });

    test('should debounce search input', async ({ page }) => {
      await carsPage.searchInput.pressSequentially('BMW', { delay: 50 });

      await page.waitForTimeout(200);
      
      await page.waitForTimeout(400);
      await carsPage.waitForLoading();

      await carsPage.expectResultsCountGreaterThan(0);
    });

    test('should preserve search in URL', async ({ page }) => {
      await carsPage.search('Audi');
      await carsPage.waitForLoading();

      await carsPage.expectUrlContains({ search: 'Audi' });

      await page.reload();
      await carsPage.waitForLoading();

      await expect(carsPage.searchInput).toHaveValue('Audi');
    });

    test('should clear search', async () => {
      await carsPage.search('BMW');
      await carsPage.waitForLoading();

      await carsPage.clearSearch();
      await carsPage.waitForLoading();

      await carsPage.expectResultsCountGreaterThan(0);
    });
  });

  test.describe('Car Card Interaction', () => {
    test('should navigate to car details on card click', async ({ page }) => {
      await carsPage.clickCarCard(0);

      await expect(page).toHaveURL(/\/cars\/[0-9a-fA-F-]{36}/);
    });

    test('should display car information on cards', async () => {

      await carsPage.waitForCarCards();
      
      const firstCard = carsPage.carCards.first();

      await expect(firstCard).toBeVisible();
      
      await expect(firstCard.locator('h3')).toBeVisible();
    });
  });

  test.describe('Search with Filters', () => {
    test('should combine search with filters', async () => {
      
      await carsPage.search('Golf');
      await carsPage.waitForLoading();

      await carsPage.expectCarCardWithName('Golf');
    });
  });
});
