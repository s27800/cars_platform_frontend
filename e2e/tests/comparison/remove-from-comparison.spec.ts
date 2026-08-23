import { test, expect } from '@playwright/test';
import { ComparisonPage, CarDetailsPage } from '../../pages';


test.describe('Comparison - Remove Cars', () => {
  let comparisonPage: ComparisonPage;

  test.beforeEach(async ({ page }) => {
    comparisonPage = new ComparisonPage(page);
    
    // Clear and add cars for comparison
    await page.goto('/');

    await page.evaluate(() => {
      localStorage.removeItem('comparisonCars');
    });

    // Add two cars
    const detailsPage = new CarDetailsPage(page);
    
    await detailsPage.goto(1);
    await detailsPage.waitForLoading();
    await detailsPage.addToComparison();

    await detailsPage.goto(2);
    await detailsPage.waitForLoading();
    await detailsPage.addToComparison();
  });

  test.describe('Remove Single Car', () => {
    test('COMP-012: should remove single car from comparison', async ({ page }) => {
      await comparisonPage.goto();
      
      // Should have 2 cars initially
      await comparisonPage.expectCarsCount(2);

      // Remove first car
      await comparisonPage.removeCarByIndex(0);

      // Should have 1 car now
      await comparisonPage.expectCarsCount(1);
    });

    test('should update localStorage when car removed', async ({ page }) => {
      await comparisonPage.goto();
      
      // Get initial count
      const initialStored = await page.evaluate(() => {
        const stored = localStorage.getItem('comparisonCars');
        return stored ? JSON.parse(stored).length : 0;
      });

      expect(initialStored).toBe(2);

      // Remove a car
      await comparisonPage.removeCarByIndex(0);
      await page.waitForTimeout(300);

      // Check localStorage updated
      const afterRemove = await page.evaluate(() => {
        const stored = localStorage.getItem('comparisonCars');
        return stored ? JSON.parse(stored).length : 0;
      });

      expect(afterRemove).toBe(1);
    });
  });

  test.describe('Clear All Cars', () => {
    test('COMP-013: should clear all cars from comparison', async ({ page }) => {
      await comparisonPage.goto();
      
      // Should have cars initially
      await comparisonPage.expectCarsCount(2);

      // Clear all
      await comparisonPage.removeAllCars();

      // Should show empty state
      await comparisonPage.expectEmptyState();
    });

    test('should clear localStorage when all cars removed', async ({ page }) => {
      await comparisonPage.goto();
      
      // Clear all
      await comparisonPage.removeAllCars();
      await page.waitForTimeout(300);

      // Check localStorage is empty
      const stored = await page.evaluate(() => {
        const data = localStorage.getItem('comparisonCars');
        return data ? JSON.parse(data).length : 0;
      });

      expect(stored).toBe(0);
    });
  });

  test.describe('Empty State', () => {
    test('COMP-014: should show message when comparison is empty', async ({ page }) => {
      await comparisonPage.goto();
      
      // Remove all cars one by one
      await comparisonPage.removeCarByIndex(0);
      await comparisonPage.removeCarByIndex(0);

      // Should show empty state message
      await comparisonPage.expectEmptyState();
    });

    test('should show add car prompt when empty', async ({ page }) => {
      
      // Clear all cars
      await page.evaluate(() => {
        localStorage.removeItem('comparisonCars');
      });

      await comparisonPage.goto();

      // Should show empty state with prompt to add cars
      await comparisonPage.expectEmptyState();
      
      // Should have a way to add cars (search or link)
      const addPrompt = page.getByText(/add|dodaj|search|szukaj/i);
      await expect(addPrompt).toBeVisible();
    });
  });

  test.describe('Re-add After Remove', () => {
    test('should allow re-adding a removed car', async ({ page }) => {
      await comparisonPage.goto();
      
      // Remove first car
      await comparisonPage.removeCarByIndex(0);
      await comparisonPage.expectCarsCount(1);

      // Go back and add the car again
      const detailsPage = new CarDetailsPage(page);
      
      await detailsPage.goto(1);
      await detailsPage.waitForLoading();
      
      // Should be able to add again
      await expect(detailsPage.addToComparisonButton).not.toContainText(/added|dodano/i);
      
      await detailsPage.addToComparison();

      // Go to comparison
      await comparisonPage.goto();
      
      // Should have 2 cars again
      await comparisonPage.expectCarsCount(2);
    });
  });
});
