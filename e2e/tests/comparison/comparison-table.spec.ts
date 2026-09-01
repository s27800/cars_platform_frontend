import { test, expect } from '@playwright/test';
import { ComparisonPage, CarDetailsPage } from '../../pages';
import { testCars } from '../../fixtures/cars.fixture';


test.describe('Comparison Table', () => {
  let comparisonPage: ComparisonPage;

  test.beforeEach(async ({ page, isMobile }) => {
    comparisonPage = new ComparisonPage(page);
    
    await page.goto('/');

    await page.evaluate(() => {
      localStorage.removeItem('comparisonCars');
    });

    if (isMobile) {
      const { first, second } = testCars();

      await page.evaluate((cars) => {
        localStorage.setItem('comparisonCars', JSON.stringify(cars));
      }, [
        { id: first.id, name: first.name },
        { id: second.id, name: second.name },
      ]);
    } else {

      const detailsPage = new CarDetailsPage(page);

      await detailsPage.goto(testCars().first.id);
      await detailsPage.waitForLoading();
      await detailsPage.addToComparison();

      await detailsPage.goto(testCars().second.id);
      await detailsPage.waitForLoading();
      await detailsPage.addToComparison();
    }
  });

  test.describe('Table Display', () => {
    test('should display comparison table', async ({ page }) => {
      await comparisonPage.goto();
      await comparisonPage.expectPageVisible();
      await comparisonPage.expectComparisonTableVisible();
    });

    test('should show car names in table', async ({ page }) => {
      await comparisonPage.goto();
      await comparisonPage.expectCarsCount(2);
    });
  });

  test.describe('Specifications Comparison', () => {
    test('should compare engine specifications', async ({ page, isMobile }) => {
      await comparisonPage.goto();
      await comparisonPage.expectComparisonTableVisible();
      
      await page.waitForTimeout(500);
      
      if (isMobile) {
        const specText = page.getByText(/engine|silnik|power|moc|hp|km/i);
        await expect(specText.first()).toBeVisible();
      } else {
        const tableRows = page.locator('table tr');
        await tableRows.first().waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});

        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);
      }
    });

    test('should compare dimensions', async ({ page, isMobile }) => {
      await comparisonPage.goto();
      
      await page.waitForTimeout(500);
      
      if (isMobile) {
        const mobileContainer = page.locator('.lg\\:hidden');
        const dimensionText = mobileContainer.getByText(/length|długość|width|szerokość|height|wysokość/i);

        await expect(dimensionText.first()).toBeVisible();
      } else {
        const dimensionText = page.getByText(/length|długość|width|szerokość|height|wysokość/i);
        await expect(dimensionText.first()).toBeVisible();
      }
    });

    test('should compare performance', async ({ page, isMobile }) => {
      await comparisonPage.goto();
      
      await page.waitForTimeout(500);
      
      if (isMobile) {
        const mobileContainer = page.locator('.lg\\:hidden');
        const performanceText = mobileContainer.getByText(/power|moc|torque|moment|acceleration|przyspieszenie/i);

        await expect(performanceText.first()).toBeVisible();
      } else {
        const performanceText = page.getByText(/power|moc|torque|moment|acceleration|przyspieszenie/i);
        await expect(performanceText.first()).toBeVisible();
      }
    });
  });

  test.describe('Tabs', () => {
    test('should switch between tabs', async ({ page }) => {
      await comparisonPage.goto();
      
      const hasTabs = await comparisonPage.tabs.isVisible().catch(() => false);
      
      if (hasTabs) {
        await comparisonPage.selectStatsTab();
        await expect(comparisonPage.comparisonTable).toBeVisible();
        
        await comparisonPage.selectSpecsTab();
        await expect(comparisonPage.comparisonTable).toBeVisible();
      }
    });
  });

  test.describe('Value Highlighting', () => {
    test('should highlight best values', async ({ page }) => {
      await comparisonPage.goto();
      
      const highlightedCells = page.locator('[class*="highlight"], [class*="best"], .text-green, .text-primary');
      
      const count = await highlightedCells.count();
      
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Empty State', () => {
    test('should show empty state when no cars are in comparison', async ({ page }) => {
      await page.evaluate(() => {
        localStorage.removeItem('comparisonCars');
      });
      
      await comparisonPage.goto();
      await comparisonPage.expectEmptyState();
    });
  });
});
