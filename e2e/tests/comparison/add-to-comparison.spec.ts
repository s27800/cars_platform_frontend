import { test, expect } from '@playwright/test';
import { ComparisonPage, CarDetailsPage, CarsSearchPage } from '../../pages';
import { testCars } from '../../fixtures/cars.fixture';


test.describe('Comparison - Add Cars', () => {
  let comparisonPage: ComparisonPage;

  test.beforeEach(async ({ page }) => {

    await page.goto('/');

    await page.evaluate(() => {
      localStorage.removeItem('comparisonCars');
    });
    
    comparisonPage = new ComparisonPage(page);
  });

  test.describe('Add to Comparison', () => {
    test('should add car to comparison from search list', async ({ page }) => {
      const searchPage = new CarsSearchPage(page);

      await searchPage.goto();
      await searchPage.waitForLoading();

      const firstCard = searchPage.carCards.first();
      const addButton = firstCard.getByRole('button', { name: /compare|porównaj/i });
      
      if (await addButton.isVisible()) {
        await addButton.click();

        await comparisonPage.goto();
        await comparisonPage.expectCarsCount(1);
      }
    });

    test('should add car from details page', async ({ page }) => {
      const detailsPage = new CarDetailsPage(page);

      await detailsPage.goto(testCars().first.id);
      await detailsPage.waitForLoading();
      await detailsPage.addToComparison();

      await comparisonPage.goto();
      await comparisonPage.expectCarsCount(1);
    });

    test('should limit maximum cars in comparison', async ({ page }) => {
      for (const car of testCars().all) {
        const detailsPage = new CarDetailsPage(page);

        await detailsPage.goto(car.id);
        await detailsPage.waitForLoading();

        const addButton = detailsPage.addToComparisonButton;
        const isDisabled = await addButton.isDisabled().catch(() => false);
        
        if (!isDisabled) {
          await addButton.scrollIntoViewIfNeeded();
          await addButton.click({ force: true });
          await page.waitForTimeout(300);
        }
      }

      await comparisonPage.goto();
      
      const carCount = await page.evaluate(() => {
        const stored = localStorage.getItem('comparisonCars');
        return stored ? JSON.parse(stored).length : 0;
      });
      
      expect(carCount).toBeLessThanOrEqual(4);
    });

    test('should prevent duplicate cars', async ({ page }) => {
      const detailsPage = new CarDetailsPage(page);

      await detailsPage.goto(testCars().first.id);
      await detailsPage.waitForLoading();
      await detailsPage.addToComparison();
      
      await expect(detailsPage.addToComparisonButton).toContainText(/added|dodano|remove/i);
    });

    test('should persist comparison in localStorage', async ({ page }) => {
      const detailsPage = new CarDetailsPage(page);
      
      await detailsPage.goto(testCars().first.id);
      await detailsPage.waitForLoading();
      await detailsPage.addToComparison();

      const stored = await page.evaluate(() => localStorage.getItem('comparisonCars'));
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBe(1);

      await page.reload();
      
      const storedAfterReload = await page.evaluate(() => localStorage.getItem('comparisonCars'));
      expect(storedAfterReload).toBe(stored);
    });
  });
});
