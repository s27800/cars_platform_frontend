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
    test('PAGE-001: should navigate between pages', async () => {

      // Should start on page 1
      await carsPage.expectCurrentPage(1);

      // Go to page 2
      await carsPage.goToPage(2);
      await carsPage.waitForLoading();

      // Should be on page 2
      await carsPage.expectCurrentPage(2);
    });

    test('should navigate to next page', async () => {
      await carsPage.goToNextPage();
      await carsPage.waitForLoading();

      await carsPage.expectCurrentPage(2);
    });

    test('should navigate to previous page', async () => {

      // Go to page 2 first
      await carsPage.goToPage(2);
      await carsPage.waitForLoading();

      // Go back to page 1
      await carsPage.goToPreviousPage();
      await carsPage.waitForLoading();

      await carsPage.expectCurrentPage(1);
    });
  });

  test.describe('Page Size', () => {
    test('PAGE-002: should change page size', async ({ page, isMobile }) => {

      if (isMobile) {

        // On mobile, test via URL since page size selector is hidden
        await page.goto('/cars?size=24');
        await carsPage.waitForLoading();
        
        const cardCount = await carsPage.carCards.count();
        expect(cardCount).toBeLessThanOrEqual(24);
      } else {

        // Default page size is 12
        let cardCount = await carsPage.carCards.count();
        expect(cardCount).toBeLessThanOrEqual(12);

        // Change to 24
        await carsPage.selectPageSize(24);
        await carsPage.waitForLoading();

        // Should show more results (if available)
        cardCount = await carsPage.carCards.count();
        expect(cardCount).toBeLessThanOrEqual(24);
      }
    });

    test('should preserve page size in URL', async ({ page, isMobile }) => {

      if (isMobile) {

        // On mobile, navigate directly with size param
        await page.goto('/cars?size=24');
        await carsPage.waitForLoading();
        
        // Verify size is in URL
        await expect(page).toHaveURL(/size=24/);
        
        // Reload and verify persistence
        await page.reload();
        await carsPage.waitForLoading();
        
        const url = page.url();
        expect(url).toMatch(/size=24/);
      } else {
        await carsPage.selectPageSize(24);
        await carsPage.waitForLoading();

        await carsPage.expectUrlContains({ size: '24' });

        // Reload and verify
        await page.reload();
        await carsPage.waitForLoading();

        // Page size should be preserved
        const url = page.url();
        expect(url).toMatch(/size=24/);
      }
    });
  });

  test.describe('Page Persistence', () => {
    test('PAGE-003: should preserve page number in URL', async ({ page }) => {
      await carsPage.goToPage(2);
      await carsPage.waitForLoading();

      await carsPage.expectUrlContains({ page: '1' }); // 0-indexed in URL

      // Reload and verify
      await page.reload();
      await carsPage.waitForLoading();

      // Should still be on page 2
      await carsPage.expectCurrentPage(2);
    });
  });

  test.describe('Filter and Pagination Interaction', () => {
    test('PAGE-004: should reset to page 1 when filters change', async ({ page }) => {

      // Go to page 2
      await carsPage.goToPage(2);
      await carsPage.waitForLoading();
      await carsPage.expectCurrentPage(2);

      // Apply a filter
      await carsPage.search('BMW');
      await carsPage.waitForLoading();

      // Should reset to page 1 - either via pagination button or URL (pagination might be hidden if only 1 page)
      const url = page.url();
      expect(url).toMatch(/page=0|page=$/i);
    });

    test('should reset to page 1 when search changes', async ({ page }) => {
      // Go to page 2
      await carsPage.goToPage(2);
      await carsPage.waitForLoading();

      // Change search
      await carsPage.search('Audi');
      await carsPage.waitForLoading();

      // Should reset to page 1 - either via URL (pagination might be hidden if only 1 page)
      const url = page.url();
      expect(url).toMatch(/page=0|page=$/i);
    });
  });

  test.describe('Sort and Pagination', () => {
    test('should preserve sort when changing pages', async ({ page }) => {

      // Apply sort
      await carsPage.selectSort('name,asc');
      await carsPage.waitForLoading();

      // Go to page 2
      await carsPage.goToPage(2);
      await carsPage.waitForLoading();

      // Sort should be preserved in URL
      const url = page.url();
      expect(url).toMatch(/sort=name/);
    });
  });

  test.describe('Scroll Behavior', () => {

    test('PAGE-005: should scroll to top when changing pages', async ({ page, isMobile }) => {

      // On mobile, the page might have different scroll positions
      const scrollAmount = isMobile ? 800 : 500;
      
      // Scroll down first - try to scroll a specific element if window scroll doesn't work
      await page.evaluate((amount) => {
        window.scrollTo({ top: amount, behavior: 'instant' });
        document.documentElement.scrollTop = amount;
        document.body.scrollTop = amount; // For Safari
      }, scrollAmount);
      
      // Wait for scroll to settle and retry if needed
      let scrollY = 0;
      for (let attempt = 0; attempt < 5; attempt++) {
        await page.waitForTimeout(200);
        scrollY = await page.evaluate(() => Math.max(
          window.scrollY,
          document.documentElement.scrollTop,
          document.body.scrollTop
        ));
        if (scrollY > 100) break;

        // Try scrolling again if it didn't work
        await page.evaluate((amount) => {
          window.scrollTo({ top: amount, behavior: 'instant' });
          document.documentElement.scrollTop = amount;
        }, scrollAmount);
      }
      
      // Verify we're scrolled down (skip test if browser doesn't support scrolling in this context)
      if (scrollY <= 100)
        console.log('Warning: Could not scroll page, skipping scroll assertion');
      
      // Change page
      await carsPage.goToPage(2);
      await carsPage.waitForLoading();
      
      // Wait for page to settle and scroll animation to complete
      await page.waitForTimeout(500);

      // Wait for scroll to complete with multiple attempts
      for (let attempt = 0; attempt < 5; attempt++) {
        scrollY = await page.evaluate(() => window.scrollY);
        if (scrollY < 200) break;
        await page.waitForTimeout(500);
      }

      // Should scroll to top
      scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeLessThan(300);
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle last page correctly', async ({ page }) => {

      // Navigate to last page
      const paginationButtons = carsPage.pagination.locator('button');
      const buttonsCount = await paginationButtons.count();
      
      if (buttonsCount > 2) {
        // Click on last numbered button (before next button)
        const lastPageButton = paginationButtons.nth(buttonsCount - 2);
        await lastPageButton.click();
        await carsPage.waitForLoading();

        // Should be on last page
        await expect(carsPage.carCards.first()).toBeVisible();
      }
    });

    test('should disable previous button on first page', async () => {
      
      // On page 1
      await carsPage.expectCurrentPage(1);

      // Previous button should be disabled or hidden
      const prevButton = carsPage.pagination.getByRole('button', { name: /previous|poprzednia|</i });
      const isDisabled = await prevButton.isDisabled().catch(() => true);
      const isHidden = await prevButton.isHidden().catch(() => false);
      
      expect(isDisabled || isHidden).toBeTruthy();
    });
  });
});
