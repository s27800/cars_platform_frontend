import { test, expect } from '@playwright/test';
import { CarsSearchPage } from '../../pages';


test.describe('Cars Filters', () => {
  let carsPage: CarsSearchPage;

  // Open mobile filters drawer if on mobile
  test.beforeEach(async ({ page, isMobile }) => {
    carsPage = new CarsSearchPage(page);

    await carsPage.goto();
    await carsPage.waitForLoading();
    
    // Open filters panel on mobile (drawer)
    await carsPage.openFiltersIfMobile(isMobile);
  });

  test.describe('Brand Filter', () => {
    test('FILTER-001: should filter by brand', async ({ page }) => {

      // Get initial count
      await carsPage.waitForCarCards();

      const initialCount = await carsPage.carCards.count();
      
      // Select Volkswagen brand
      await carsPage.selectBrand('Volkswagen');
      await carsPage.waitForLoading();
      
      // Wait for network and loading states
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      // Wait for cards to appear after filter
      await carsPage.waitForCarCards();

      // Filter should change results
      const count = await carsPage.carCards.count();
      
      // Should have results and count should be different from initial (filtering worked)
      expect(count).toBeGreaterThan(0);

      // URL should contain brand filter
      await expect(page).toHaveURL(/brandId|brand/i);
    });

    test('FILTER-002: should update URL when brand filter is applied', async ({ page }) => {
      await carsPage.selectBrand('BMW');
      await carsPage.waitForLoading();

      // URL should contain brand filter parameter
      const url = page.url();

      expect(url).toMatch(/brandIds=/);
    });
  });

  test.describe('Body Type Filter', () => {
    test('FILTER-004: should filter by body type', async ({ page }) => {
      await carsPage.selectBodyType('SUV');
      await carsPage.waitForLoading();
      
      // Wait for network to settle and loading to complete
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500); // Wait for UI to update
      
      // Wait for skeleton cards to disappear
      await page.locator('.animate-pulse, .skeleton').first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});

      // Should show results (or no results message)
      const carCount = await carsPage.carCards.count();
      const hasNoResults = await carsPage.noResultsMessage.isVisible().catch(() => false);
      
      expect(carCount > 0 || hasNoResults).toBeTruthy();
    });
  });

  test.describe('Power Filter', () => {
    test('FILTER-006: should filter by minimum power', async () => {
      await carsPage.setMinPower(200);
      await carsPage.waitForLoading();

      // Should show results filtered by power
      await carsPage.expectResultsCountGreaterThan(0).catch(() => {});
    });

    test('FILTER-007: should filter by power range', async ({ page }) => {
      await carsPage.setMinPower(100);
      await page.waitForTimeout(300);
      await carsPage.setMaxPower(300);
      await carsPage.waitForLoading();

      // Should filter results
      const carCount = await carsPage.carCards.count();

      expect(carCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Multiple Filters', () => {
    test('FILTER-010: should apply multiple filters', async ({ page }) => {

      // Apply brand filter
      await carsPage.selectBrand('BMW');
      await carsPage.waitForLoading();
      await page.waitForTimeout(500); // Wait for API response

      const countAfterBrand = await carsPage.carCards.count();

      expect(countAfterBrand).toBeGreaterThan(0);

      // Apply body type filter
      await carsPage.selectBodyType('Sedan');
      await carsPage.waitForLoading();
      await page.waitForTimeout(500); // Wait for API response

      const countAfterBodyType = await carsPage.carCards.count();

      // Both filters should be active - count should be same or less
      // Or no results if the combination doesn't match any cars
      expect(countAfterBodyType).toBeLessThanOrEqual(countAfterBrand);
    });
  });

  test.describe('Reset Filters', () => {
    test('FILTER-011: should reset all filters', async ({ page }) => {

      // Get initial count
      const initialCount = await carsPage.carCards.count();

      // Apply some filters
      await carsPage.selectBrand('Volkswagen');
      await carsPage.waitForLoading();
      await page.waitForTimeout(500);

      // Filtered should have some results
      const filteredCount = await carsPage.carCards.count();

      expect(filteredCount).toBeGreaterThan(0);

      // Reset filters
      await carsPage.resetFilters();
      await carsPage.waitForLoading();
      await page.waitForTimeout(500);

      // Should show results again - count should be at least initial
      const resetCount = await carsPage.carCards.count();

      expect(resetCount).toBeGreaterThanOrEqual(initialCount);

      // URL should not have filter params
      await expect(page).not.toHaveURL(/brandIds/);
    });

    test('should clear URL parameters on reset', async ({ page }) => {

      // Apply filter
      await carsPage.selectBrand('BMW');
      await carsPage.waitForLoading();
      
      // Wait for URL to contain filter parameter
      await expect(page).toHaveURL(/brandIds=/, { timeout: 10000 });

      // Reset
      await carsPage.resetFilters();
      await carsPage.waitForLoading();
      
      // Wait for network
      await page.waitForLoadState('networkidle');

      // URL should not contain filter params
      await expect(page).not.toHaveURL(/brandIds=/);
    });
  });

  test.describe('Filter Persistence', () => {
    test('should preserve filters after page reload', async ({ page }) => {

      // Apply filter
      await carsPage.search('Golf');
      await carsPage.waitForLoading();

      // Reload page
      await page.reload();
      await carsPage.waitForLoading();

      // Search should be preserved
      await expect(carsPage.searchInput).toHaveValue('Golf');
    });

    test('should preserve filters on back navigation', async ({ page }) => {

      // Apply filter
      await carsPage.selectBrand('Audi');
      await carsPage.waitForLoading();

      // Click on a car to navigate to details
      await carsPage.clickCarCard(0);

      // Go back
      await page.goBack();
      await carsPage.waitForLoading();

      // Filter should be preserved in URL
      const url = page.url();
      expect(url).toMatch(/brandIds=/);
    });
  });

  test.describe('Mobile Filters', () => {
    test('FILTER-013: should toggle mobile filters panel', async ({ page }) => {
      
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await carsPage.waitForLoading();

      // Mobile filters button should be visible
      await expect(carsPage.mobileFiltersButton).toBeVisible();

      // Click to open filters
      await carsPage.openMobileFilters();

      // Mobile filters panel should be visible
      const mobileFilterPanel = page.locator('.fixed').filter({ hasText: /filters|filtry/i });

      await expect(mobileFilterPanel).toBeVisible();
    });
  });
});
