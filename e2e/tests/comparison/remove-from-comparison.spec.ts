import { test, expect } from '@playwright/test';
import { ComparisonPage, CarDetailsPage } from '../../pages';
import { testCars } from '../../fixtures/cars.fixture';


test.describe('Comparison - Remove Cars', () => {
  let comparisonPage: ComparisonPage;

  test.beforeEach(async ({ page }) => {
    comparisonPage = new ComparisonPage(page);
    
    await page.goto('/');

    await page.evaluate(() => {
      localStorage.removeItem('comparisonCars');
    });

    const detailsPage = new CarDetailsPage(page);
    
    await detailsPage.goto(testCars().first.id);
    await detailsPage.waitForLoading();
    await detailsPage.addToComparison();

    await detailsPage.goto(testCars().second.id);
    await detailsPage.waitForLoading();
    await detailsPage.addToComparison();
  });

  test.describe('Remove Single Car', () => {
    test('should remove single car from comparison', async ({ page }) => {
      await comparisonPage.goto();
      await comparisonPage.expectCarsCount(2);
      await comparisonPage.removeCarByIndex(0);
      await comparisonPage.expectCarsCount(1);
    });

    test('should update localStorage when car removed', async ({ page }) => {
      await comparisonPage.goto();
      
      const initialStored = await page.evaluate(() => {
        const stored = localStorage.getItem('comparisonCars');
        return stored ? JSON.parse(stored).length : 0;
      });

      expect(initialStored).toBe(2);

      await comparisonPage.removeCarByIndex(0);
      await page.waitForTimeout(300);

      const afterRemove = await page.evaluate(() => {
        const stored = localStorage.getItem('comparisonCars');
        return stored ? JSON.parse(stored).length : 0;
      });

      expect(afterRemove).toBe(1);
    });
  });

  test.describe('Clear All Cars', () => {
    test('should clear all cars from comparison', async ({ page }) => {
      await comparisonPage.goto();
      await comparisonPage.expectCarsCount(2);
      await comparisonPage.removeAllCars();
      await comparisonPage.expectEmptyState();
    });

    test('should clear localStorage when all cars removed', async ({ page }) => {
      await comparisonPage.goto();
      await comparisonPage.removeAllCars();

      await page.waitForTimeout(300);

      const stored = await page.evaluate(() => {
        const data = localStorage.getItem('comparisonCars');
        return data ? JSON.parse(data).length : 0;
      });

      expect(stored).toBe(0);
    });
  });

  test.describe('Empty State', () => {
    test('should show message when comparison is empty', async ({ page }) => {
      await comparisonPage.goto();
      await comparisonPage.removeCarByIndex(0);
      await comparisonPage.removeCarByIndex(0);
      await comparisonPage.expectEmptyState();
    });

    test('should show add car prompt when empty', async ({ page }) => {
      
      await page.evaluate(() => {
        localStorage.removeItem('comparisonCars');
      });

      await comparisonPage.goto();
      await comparisonPage.expectEmptyState();
      
      const addPrompt = page.getByText(/add|dodaj|search|szukaj/i);
      await expect(addPrompt).toBeVisible();
    });
  });

  test.describe('Re-add After Remove', () => {
    test('should allow re-adding a removed car', async ({ page }) => {
      await comparisonPage.goto();
      await comparisonPage.removeCarByIndex(0);
      await comparisonPage.expectCarsCount(1);

      const detailsPage = new CarDetailsPage(page);
      await detailsPage.goto(testCars().first.id);
      await detailsPage.waitForLoading();
      await expect(detailsPage.addToComparisonButton).not.toContainText(/added|dodano/i);
      await detailsPage.addToComparison();

      await comparisonPage.goto();
      await comparisonPage.expectCarsCount(2);
    });
  });
});
