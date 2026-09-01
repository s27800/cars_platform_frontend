import { test, expect } from '@playwright/test';
import { CarDetailsPage, CarsSearchPage } from '../../pages';
import { testCars } from '../../fixtures/cars.fixture';


test.describe('Car Details', () => {
  let carDetailsPage: CarDetailsPage;

  test.beforeEach(async ({ page }) => {
    carDetailsPage = new CarDetailsPage(page);
  });

  test.describe('Page Display', () => {
    test('should display car details', async ({ page }) => {
      const searchPage = new CarsSearchPage(page);

      await searchPage.goto();
      await searchPage.waitForLoading();
      
      await searchPage.clickCarCard(0);
      
      await expect(page).toHaveURL(/\/cars\/[0-9a-fA-F-]{36}/);
      
      await carDetailsPage.expectPageVisible();
    });

    test('should display car title', async ({ page }) => {
      await carDetailsPage.goto(testCars().first.id);
      await carDetailsPage.waitForLoading();

      await expect(carDetailsPage.carTitle).toBeVisible();
    });
  });

  test.describe('Image Gallery', () => {
    test('should display image gallery', async ({ page }) => {
      await carDetailsPage.goto(testCars().first.id);
      await carDetailsPage.waitForLoading();
      await carDetailsPage.expectImageGalleryVisible();
    });

    test('should navigate through gallery images', async ({ page }) => {
      await carDetailsPage.goto(testCars().first.id);
      await carDetailsPage.waitForLoading();

      const hasNextButton = await carDetailsPage.galleryNext.isVisible().catch(() => false);
      
      if (hasNextButton) {

        await carDetailsPage.clickNextImage();
        
        await carDetailsPage.expectImageGalleryVisible();
      }
    });
  });

  test.describe('Specifications', () => {
    test('should display specifications section', async ({ page }) => {
      await carDetailsPage.goto(testCars().first.id);
      await carDetailsPage.waitForLoading();
      await carDetailsPage.expectSpecificationsVisible();
    });
  });

  test.describe('Reviews Section', () => {
    test('should display reviews section', async ({ page }) => {
      await carDetailsPage.goto(testCars().first.id);
      await carDetailsPage.waitForLoading();
      await carDetailsPage.expectReviewsSection();
    });
  });

  test.describe('Comparison', () => {
    test('should add car to comparison', async ({ page }) => {
      await carDetailsPage.goto(testCars().first.id);
      await carDetailsPage.waitForLoading();

      await carDetailsPage.addToComparison();

      await carDetailsPage.expectAddedToComparison();

      const comparison = await page.evaluate(() => {
        return localStorage.getItem('comparisonCars');
      });

      expect(comparison).toBeTruthy();
    });
  });

  test.describe('Breadcrumbs', () => {
    test('should display breadcrumb navigation', async ({ page }) => {
      await carDetailsPage.goto(testCars().first.id);
      await carDetailsPage.waitForLoading();
      await carDetailsPage.expectBreadcrumbsVisible();
    });

    test('should navigate via breadcrumb', async ({ page }) => {
      await carDetailsPage.goto(testCars().first.id);
      await carDetailsPage.waitForLoading();

      await carDetailsPage.clickBrandLink();

      await expect(page).toHaveURL(/\/brands\/[0-9a-fA-F-]{36}/);
    });
  });

  test.describe('Error Handling', () => {
    test('should show 404 for non-existent car', async ({ page }) => {
      await carDetailsPage.goto(testCars().missing);
      await carDetailsPage.expectNotFound();
    });
  });

  test.describe('Like Feature', () => {
    test('should require login for like button', async ({ page }) => {
      await carDetailsPage.goto(testCars().first.id);
      await carDetailsPage.waitForLoading();

      const likeButton = carDetailsPage.likeButton;
      const isVisible = await likeButton.isVisible().catch(() => false);

      if (isVisible) {
        await carDetailsPage.clickLike();
        
        const isOnLogin = await page.url().includes('/login');
        const hasToast = await carDetailsPage.toast.isVisible().catch(() => false);
        
        expect(isOnLogin || hasToast).toBeTruthy();
      }
    });
  });

  test.describe('Add Review', () => {
    test('should show add review button when logged in', async ({ page }) => {
      const loginPage = new (await import('../../pages/LoginPage')).LoginPage(page);

      await loginPage.goto();
      await loginPage.login('john_smith', 'Test123!');

      await page.waitForURL(/\/(cars|home|$)/);
      
      await carDetailsPage.goto(testCars().first.id);
      await carDetailsPage.waitForLoading();

      await carDetailsPage.clickReviewsTab();
      
      await expect(carDetailsPage.addReviewButton).toBeVisible();
    });

    test('should require login to add review', async ({ page }) => {
      await carDetailsPage.goto(testCars().first.id);
      await carDetailsPage.waitForLoading();

      await carDetailsPage.clickReviewsTab();

      const loginButton = page.getByRole('link', { name: /login/i });
      const loginPrompt = page.getByText(/login to interact|login to write/i);
      
      const hasLoginButton = await loginButton.isVisible().catch(() => false);
      const hasLoginPrompt = await loginPrompt.isVisible().catch(() => false);
      
      expect(hasLoginButton || hasLoginPrompt).toBeTruthy();
    });
  });

  test.describe('Fuel Reports', () => {
    test('should show fuel reports section', async ({ page }) => {
      await carDetailsPage.goto(testCars().first.id);
      await carDetailsPage.waitForLoading();

      const section = carDetailsPage.fuelReportsSection;
      
      await expect(section).toBeVisible();
    });
  });
});
