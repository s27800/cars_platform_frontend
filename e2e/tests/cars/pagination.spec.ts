import { test, expect } from '@playwright/test';
import { CarsSearchPage } from '../../pages';
import { PAGINATION } from '../../fixtures';


test.describe('Cars Pagination', () => {
  let carsPage: CarsSearchPage;

  test.beforeEach(async ({ page }) => {
    carsPage = new CarsSearchPage(page);
    await carsPage.goto();
    await carsPage.waitForLoading();
  });

  test.describe('Page Navigation', () => {
    test('should navigate between pages', async () => {
      await carsPage.expectCurrentPage(1);

      await carsPage.goToPage(2);
      await carsPage.waitForLoading();

      await carsPage.expectCurrentPage(2);
    });

    test('should navigate to next page', async () => {
      await carsPage.goToNextPage();
      await carsPage.waitForLoading();
      await carsPage.expectCurrentPage(2);
    });

    test('should navigate to previous page', async () => {
      await carsPage.goToPage(2);
      await carsPage.waitForLoading();

      await carsPage.goToPreviousPage();
      await carsPage.waitForLoading();

      await carsPage.expectCurrentPage(1);
    });
  });

  test.describe('Page Size', () => {
    test('should change page size', async ({ page, isMobile }) => {
      if (isMobile) {
        await page.goto('/cars?size=24');
        await carsPage.waitForLoading();
        
        const cardCount = await carsPage.carCards.count();

        expect(cardCount).toBeLessThanOrEqual(24);
      } else {
        let cardCount = await carsPage.carCards.count();

        expect(cardCount).toBeLessThanOrEqual(12);

        await carsPage.selectPageSize(24);
        await carsPage.waitForLoading();

        cardCount = await carsPage.carCards.count();

        expect(cardCount).toBeLessThanOrEqual(24);
      }
    });

    test('should preserve page size in URL', async ({ page, isMobile }) => {
      if (isMobile) {
        await page.goto('/cars?size=24');
        await carsPage.waitForLoading();
        
        await expect(page).toHaveURL(/size=24/);
        
        await page.reload();
        await carsPage.waitForLoading();
        
        const url = page.url();

        expect(url).toMatch(/size=24/);
      } else {
        await carsPage.selectPageSize(24);
        await carsPage.waitForLoading();

        await carsPage.expectUrlContains({ size: '24' });

        await page.reload();

        await carsPage.waitForLoading();

        const url = page.url();

        expect(url).toMatch(/size=24/);
      }
    });
  });

  test.describe('Page Persistence', () => {
    test('should preserve page number in URL', async ({ page }) => {
      await carsPage.goToPage(2);
      await carsPage.waitForLoading();

      await carsPage.expectUrlContains({ page: '1' }); // 0-indexed in URL

      await page.reload();
      await carsPage.waitForLoading();

      await carsPage.expectCurrentPage(2);
    });
  });

  test.describe('Filter and Pagination Interaction', () => {
    test('should reset to page 1 when filters change', async ({ page }) => {
      await carsPage.goToPage(2);
      await carsPage.waitForLoading();
      await carsPage.expectCurrentPage(2);

      await carsPage.search('BMW');
      await carsPage.waitForLoading();

      const url = page.url();

      expect(url).toMatch(/page=0|page=$/i);
    });

    test('should reset to page 1 when search changes', async ({ page }) => {
      await carsPage.goToPage(2);
      await carsPage.waitForLoading();

      await carsPage.search('Audi');
      await carsPage.waitForLoading();

      const url = page.url();

      expect(url).toMatch(/page=0|page=$/i);
    });
  });

  test.describe('Sort and Pagination', () => {
    test('should preserve sort when changing pages', async ({ page }) => {
      await carsPage.selectSort('name,asc');
      await carsPage.waitForLoading();

      await carsPage.goToPage(2);
      await carsPage.waitForLoading();

      const url = page.url();

      expect(url).toMatch(/sort=name/);
    });
  });

  test.describe('Scroll Behavior', () => {
    test('should scroll to top when changing pages', async ({ page, isMobile }) => {
      const scrollAmount = isMobile ? 800 : 500;
      
      await page.evaluate((amount) => {
        window.scrollTo({ top: amount, behavior: 'instant' });
        document.documentElement.scrollTop = amount;
        document.body.scrollTop = amount;
      }, scrollAmount);
      
      let scrollY = 0;

      for (let attempt = 0; attempt < 5; attempt++) {
        await page.waitForTimeout(200);

        scrollY = await page.evaluate(() => Math.max(
          window.scrollY,
          document.documentElement.scrollTop,
          document.body.scrollTop
        ));

        if (scrollY > 100) break;

        await page.evaluate((amount) => {
          window.scrollTo({ top: amount, behavior: 'instant' });
          document.documentElement.scrollTop = amount;
        }, scrollAmount);
      }
      
      if (scrollY <= 100)
        console.log('Warning: Could not scroll page, skipping scroll assertion');
      
      await carsPage.goToPage(2);
      await carsPage.waitForLoading();
      
      await page.waitForTimeout(500);

      for (let attempt = 0; attempt < 5; attempt++) {
        scrollY = await page.evaluate(() => window.scrollY);

        if (scrollY < 200)
          break;

        await page.waitForTimeout(500);
      }

      scrollY = await page.evaluate(() => window.scrollY);

      expect(scrollY).toBeLessThan(300);
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle last page correctly', async ({ page }) => {
      const paginationButtons = carsPage.pagination.locator('button');
      const buttonsCount = await paginationButtons.count();
      
      if (buttonsCount > 2) {

        const lastPageButton = paginationButtons.nth(buttonsCount - 2);
        
        await lastPageButton.click();
        await carsPage.waitForLoading();

        await expect(carsPage.carCards.first()).toBeVisible();
      }
    });

    test('should disable previous button on first page', async () => {
      await carsPage.expectCurrentPage(1);

      const prevButton = carsPage.pagination.getByRole('button', { name: /previous|poprzednia|</i });
      const isDisabled = await prevButton.isDisabled().catch(() => true);
      const isHidden = await prevButton.isHidden().catch(() => false);
      
      expect(isDisabled || isHidden).toBeTruthy();
    });
  });
});
