import { test, expect } from '@playwright/test';
import { CarDetailsPage, CarsSearchPage } from '../../pages';


test.describe('Car Details', () => {
  let carDetailsPage: CarDetailsPage;

  test.beforeEach(async ({ page }) => {
    carDetailsPage = new CarDetailsPage(page);
  });

  test.describe('Page Display', () => {
    test('CAR-001: should display car details', async ({ page }) => {

      // First get a car ID from search
      const searchPage = new CarsSearchPage(page);

      await searchPage.goto();
      await searchPage.waitForLoading();
      
      // Click first car
      await searchPage.clickCarCard(0);
      
      // Should navigate to details page
      await expect(page).toHaveURL(/\/cars\/\d+/);
      
      // Should display car title
      await carDetailsPage.expectPageVisible();
    });

    test('should display car title', async ({ page }) => {

      // Navigate to a specific car
      await carDetailsPage.goto(1);
      await carDetailsPage.waitForLoading();

      await expect(carDetailsPage.carTitle).toBeVisible();
    });
  });

  test.describe('Image Gallery', () => {
    test('CAR-002: should display image gallery', async ({ page }) => {
      await carDetailsPage.goto(1);
      await carDetailsPage.waitForLoading();
      await carDetailsPage.expectImageGalleryVisible();
    });

    test('should navigate through gallery images', async ({ page }) => {
      await carDetailsPage.goto(1);
      await carDetailsPage.waitForLoading();

      // Check if navigation buttons exist
      const hasNextButton = await carDetailsPage.galleryNext.isVisible().catch(() => false);
      
      if (hasNextButton) {

        // Click next
        await carDetailsPage.clickNextImage();
        
        // Gallery should still be visible
        await carDetailsPage.expectImageGalleryVisible();
      }
    });
  });

  test.describe('Specifications', () => {
    test('CAR-003: should display specifications section', async ({ page }) => {
      await carDetailsPage.goto(1);
      await carDetailsPage.waitForLoading();
      await carDetailsPage.expectSpecificationsVisible();
    });
  });

  test.describe('Reviews Section', () => {
    test('CAR-004: should display reviews section', async ({ page }) => {
      await carDetailsPage.goto(1);
      await carDetailsPage.waitForLoading();
      await carDetailsPage.expectReviewsSection();
    });
  });

  test.describe('Comparison', () => {
    test('CAR-006: should add car to comparison', async ({ page }) => {
      await carDetailsPage.goto(1);
      await carDetailsPage.waitForLoading();

      // Click add to comparison
      await carDetailsPage.addToComparison();

      // Button should change state
      await carDetailsPage.expectAddedToComparison();

      // Car should be in localStorage comparison
      const comparison = await page.evaluate(() => {
        return localStorage.getItem('comparisonCars');
      });

      expect(comparison).toBeTruthy();
    });
  });

  test.describe('Breadcrumbs', () => {
    test('CAR-008: should display breadcrumb navigation', async ({ page }) => {
      await carDetailsPage.goto(1);
      await carDetailsPage.waitForLoading();
      await carDetailsPage.expectBreadcrumbsVisible();
    });

    test('should navigate via breadcrumb', async ({ page }) => {
      await carDetailsPage.goto(1);
      await carDetailsPage.waitForLoading();

      // Click on brand link in breadcrumbs
      await carDetailsPage.clickBrandLink();

      // Should navigate to brand page
      await expect(page).toHaveURL(/\/brands\/\d+/);
    });
  });

  test.describe('Error Handling', () => {
    test('CAR-009: should show 404 for non-existent car', async ({ page }) => {

      // Navigate to non-existent car ID
      await carDetailsPage.goto(999999);
      
      // Should show not found message or redirect
      await carDetailsPage.expectNotFound();
    });
  });

  test.describe('Like Feature', () => {
    test('CAR-007: should require login for like button', async ({ page }) => {

      // As unauthenticated user
      await carDetailsPage.goto(1);
      await carDetailsPage.waitForLoading();

      // Try to like
      const likeButton = carDetailsPage.likeButton;
      const isVisible = await likeButton.isVisible().catch(() => false);

      if (isVisible) {
        await carDetailsPage.clickLike();
        
        // Should either redirect to login or show message
        const isOnLogin = await page.url().includes('/login');
        const hasToast = await carDetailsPage.toast.isVisible().catch(() => false);
        
        expect(isOnLogin || hasToast).toBeTruthy();
      }
    });
  });

  test.describe('Add Review', () => {
    test('should show add review button when logged in', async ({ page }) => {
      
      // Login first
      const loginPage = new (await import('../../pages/LoginPage')).LoginPage(page);

      await loginPage.goto();
      await loginPage.login('john_smith', 'Test123!');

      await page.waitForURL(/\/(cars|home|$)/);
      
      await carDetailsPage.goto(1);
      await carDetailsPage.waitForLoading();

      // Click reviews tab to expand it
      await carDetailsPage.clickReviewsTab();
      
      await expect(carDetailsPage.addReviewButton).toBeVisible();
    });

    test('CAR-005: should require login to add review', async ({ page }) => {
      await carDetailsPage.goto(1);
      await carDetailsPage.waitForLoading();

      // Click reviews tab to expand
      await carDetailsPage.clickReviewsTab();

      // For unauthenticated users, there should be a login prompt
      const loginButton = page.getByRole('link', { name: /login/i });
      const loginPrompt = page.getByText(/login to interact|login to write/i);
      
      const hasLoginButton = await loginButton.isVisible().catch(() => false);
      const hasLoginPrompt = await loginPrompt.isVisible().catch(() => false);
      
      expect(hasLoginButton || hasLoginPrompt).toBeTruthy();
    });
  });

  test.describe('Fuel Reports', () => {
    test('should show fuel reports section', async ({ page }) => {
      await carDetailsPage.goto(1);
      await carDetailsPage.waitForLoading();

      // Fuel reports section should exist
      const section = carDetailsPage.fuelReportsSection;
      
      await expect(section).toBeVisible();
    });
  });
});
