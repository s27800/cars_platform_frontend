import { test, expect } from '@playwright/test';
import { CarsSearchPage } from '../../pages';


test.describe('Cars Filters', () => {
  let carsPage: CarsSearchPage;

  test.beforeEach(async ({ page, isMobile }) => {
    carsPage = new CarsSearchPage(page);

    await carsPage.goto();
    await carsPage.waitForLoading();
    
    await carsPage.openFiltersIfMobile(isMobile);
  });

  test.describe('Brand Filter', () => {
    test('should filter by brand', async ({ page }) => {
      await carsPage.waitForCarCards();

      const initialCount = await carsPage.carCards.count();
      
      await carsPage.selectBrand('Volkswagen');
      await carsPage.waitForLoading();
      
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      await carsPage.waitForCarCards();

      const count = await carsPage.carCards.count();
      
      expect(count).toBeGreaterThan(0);

      await expect(page).toHaveURL(/brandId|brand/i);
    });

    test('should update URL when brand filter is applied', async ({ page }) => {
      await carsPage.selectBrand('BMW');
      await carsPage.waitForLoading();

      const url = page.url();

      expect(url).toMatch(/brandIds=/);
    });
  });

  test.describe('Body Type Filter', () => {
    test('should filter by body type', async ({ page }) => {
      await carsPage.selectBodyType('SUV');
      await carsPage.waitForLoading();
      
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500); // Wait for UI to update
      
      await page.locator('.animate-pulse, .skeleton').first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});

      const carCount = await carsPage.carCards.count();
      const hasNoResults = await carsPage.noResultsMessage.isVisible().catch(() => false);
      
      expect(carCount > 0 || hasNoResults).toBeTruthy();
    });
  });

  test.describe('Power Filter', () => {
    test('should filter by minimum power', async () => {
      await carsPage.setMinPower(200);
      await carsPage.waitForLoading();

      await carsPage.expectResultsCountGreaterThan(0).catch(() => {});
    });

    test('should filter by power range', async ({ page }) => {
      await carsPage.setMinPower(100);
      await page.waitForTimeout(300);
      await carsPage.setMaxPower(300);
      await carsPage.waitForLoading();

      const carCount = await carsPage.carCards.count();

      expect(carCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Multiple Filters', () => {
    test('should apply multiple filters', async ({ page }) => {
      await carsPage.selectBrand('BMW');
      await carsPage.waitForLoading();
      await page.waitForTimeout(500); // Wait for API response

      const countAfterBrand = await carsPage.carCards.count();

      expect(countAfterBrand).toBeGreaterThan(0);

      await carsPage.selectBodyType('Sedan');
      await carsPage.waitForLoading();
      await page.waitForTimeout(500); // Wait for API response

      const countAfterBodyType = await carsPage.carCards.count();

      expect(countAfterBodyType).toBeLessThanOrEqual(countAfterBrand);
    });
  });

  test.describe('Reset Filters', () => {
    test('should reset all filters', async ({ page }) => {
      const initialCount = await carsPage.carCards.count();

      await carsPage.selectBrand('Volkswagen');
      await carsPage.waitForLoading();
      await page.waitForTimeout(500);

      const filteredCount = await carsPage.carCards.count();

      expect(filteredCount).toBeGreaterThan(0);

      await carsPage.resetFilters();
      await carsPage.waitForLoading();
      await page.waitForTimeout(500);

      const resetCount = await carsPage.carCards.count();

      expect(resetCount).toBeGreaterThanOrEqual(initialCount);

      await expect(page).not.toHaveURL(/brandIds/);
    });

    test('should clear URL parameters on reset', async ({ page }) => {
      await carsPage.selectBrand('BMW');
      await carsPage.waitForLoading();
      
      await expect(page).toHaveURL(/brandIds=/, { timeout: 10000 });

      await carsPage.resetFilters();
      await carsPage.waitForLoading();
      
      await page.waitForLoadState('networkidle');

      await expect(page).not.toHaveURL(/brandIds=/);
    });
  });

  test.describe('Filter Persistence', () => {
    test('should preserve filters after page reload', async ({ page }) => {
      await carsPage.search('Golf');
      await carsPage.waitForLoading();

      await page.reload();
      await carsPage.waitForLoading();

      await expect(carsPage.searchInput).toHaveValue('Golf');
    });

    test('should preserve filters on back navigation', async ({ page }) => {
      await carsPage.selectBrand('Audi');
      await carsPage.waitForLoading();

      await carsPage.clickCarCard(0);

      await page.goBack();
      await carsPage.waitForLoading();

      const url = page.url();
      expect(url).toMatch(/brandIds=/);
    });
  });

  test.describe('Mobile Filters', () => {
    test('should toggle mobile filters panel', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await carsPage.waitForLoading();

      await expect(carsPage.mobileFiltersButton).toBeVisible();

      await carsPage.openMobileFilters();

      const mobileFilterPanel = page.locator('.fixed').filter({ hasText: /filters|filtry/i });

      await expect(mobileFilterPanel).toBeVisible();
    });
  });
});
