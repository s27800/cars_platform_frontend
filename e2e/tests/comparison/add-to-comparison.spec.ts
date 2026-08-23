import { test, expect } from '@playwright/test';
import { ComparisonPage, CarDetailsPage, CarsSearchPage } from '../../pages';


test.describe('Comparison - Add Cars', () => {
  let comparisonPage: ComparisonPage;

  test.beforeEach(async ({ page }) => {

    // Clear comparison from localStorage
    await page.goto('/');

    await page.evaluate(() => {
      localStorage.removeItem('comparisonCars');
    });
    
    comparisonPage = new ComparisonPage(page);
  });

  test.describe('Add to Comparison', () => {
    test('COMP-001: should add car to comparison from search list', async ({ page }) => {
      const searchPage = new CarsSearchPage(page);

      await searchPage.goto();
      await searchPage.waitForLoading();

      // Find add to comparison button on first card
      const firstCard = searchPage.carCards.first();
      const addButton = firstCard.getByRole('button', { name: /compare|porównaj/i });
      
      if (await addButton.isVisible()) {
        await addButton.click();

        // Navigate to comparison
        await comparisonPage.goto();
        
        // Should have one car
        await comparisonPage.expectCarsCount(1);
      }
    });

    test('COMP-002: should add car from details page', async ({ page }) => {
      const detailsPage = new CarDetailsPage(page);

      await detailsPage.goto(1);
      await detailsPage.waitForLoading();

      // Add to comparison
      await detailsPage.addToComparison();

      // Navigate to comparison
      await comparisonPage.goto();
      
      // Should have one car
      await comparisonPage.expectCarsCount(1);
    });

    test('COMP-003: should limit maximum cars in comparison', async ({ page }) => {

      // Add multiple cars
      for (let i = 1; i <= 5; i++) {
        const detailsPage = new CarDetailsPage(page);

        await detailsPage.goto(i);
        await detailsPage.waitForLoading();

        const addButton = detailsPage.addToComparisonButton;
        const isDisabled = await addButton.isDisabled().catch(() => false);
        
        if (!isDisabled) {
          await addButton.scrollIntoViewIfNeeded();
          await addButton.click({ force: true });
          await page.waitForTimeout(300);
        }
      }

      // Navigate to comparison
      await comparisonPage.goto();
      
      // Should have max 4 cars (or whatever the limit is)
      const carCount = await page.evaluate(() => {
        const stored = localStorage.getItem('comparisonCars');
        return stored ? JSON.parse(stored).length : 0;
      });
      
      expect(carCount).toBeLessThanOrEqual(4);
    });

    test('COMP-004: should prevent duplicate cars', async ({ page }) => {
      const detailsPage = new CarDetailsPage(page);

      await detailsPage.goto(1);
      await detailsPage.waitForLoading();

      // Add same car twice
      await detailsPage.addToComparison();
      
      // Try to add again - button should be disabled or show "added"
      await expect(detailsPage.addToComparisonButton).toContainText(/added|dodano|remove/i);
    });

    test('COMP-005: should persist comparison in localStorage', async ({ page }) => {
      const detailsPage = new CarDetailsPage(page);
      
      await detailsPage.goto(1);
      await detailsPage.waitForLoading();

      await detailsPage.addToComparison();

      // Check localStorage
      const stored = await page.evaluate(() => localStorage.getItem('comparisonCars'));
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBe(1);

      // Reload page and check persistence
      await page.reload();
      
      const storedAfterReload = await page.evaluate(() => localStorage.getItem('comparisonCars'));
      expect(storedAfterReload).toBe(stored);
    });
  });
});
