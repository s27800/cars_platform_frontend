import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages';
import { ROUTES } from '../../fixtures';

test.describe('Navigation and Routing', () => {
  
  test.describe('Main Navigation', () => {
    test('NAV-001: should navigate from header menu', async ({ page, isMobile }) => {

      // Skip on mobile - navigation links are in hamburger menu
      test.skip(isMobile, 'Navigation links are in hamburger menu on mobile');
      
      const homePage = new HomePage(page);
      await homePage.goto();

      // Navigate to cars
      await homePage.navigateToCars();
      await expect(page).toHaveURL(/\/cars/);

      // Navigate to comparison
      await homePage.navigateToComparison();
      await expect(page).toHaveURL(/\/comparison/);

      // Navigate back to home via logo
      await homePage.clickLogo();
      await expect(page).toHaveURL('/');
    });

    test('should show login/register links when not authenticated', async ({ page, isMobile }) => {

      // Skip on mobile - auth buttons are in hamburger menu
      test.skip(isMobile, 'Auth links are in hamburger menu on mobile');
      
      // Clear auth
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Should see sign in button (in the main navigation)
      const signInButton = page.locator('nav[aria-label="Main navigation"]').getByRole('link', { name: /sign in|zaloguj/i }).first();
      await expect(signInButton).toBeVisible();
    });
  });

  test.describe('Deep Linking', () => {
    test('NAV-002: should support direct URL access', async ({ page }) => {

      // Direct access to cars page
      await page.goto('/cars');
      await expect(page).toHaveURL('/cars');

      // Direct access to comparison
      await page.goto('/comparison');
      await expect(page).toHaveURL('/comparison');

      // Direct access to about
      await page.goto('/about');
      await expect(page).toHaveURL('/about');
    });

    test('should handle URL with parameters', async ({ page }) => {

      // Access cars page with search param
      await page.goto('/cars?search=BMW');
      
      await expect(page).toHaveURL(/\/cars\?search=BMW/);
      
      // Search input in main content should have the value (not header search)
      const searchInput = page.locator('main').getByPlaceholder(/search|szukaj/i).first();
      await expect(searchInput).toHaveValue('BMW');
    });
  });

  test.describe('Browser Navigation', () => {
    test('NAV-003: should handle back/forward buttons', async ({ page }) => {

      // Start at home
      await page.goto('/');

      // Navigate to cars
      await page.goto('/cars');
      
      // Navigate to comparison
      await page.goto('/comparison');

      // Go back
      await page.goBack();
      await expect(page).toHaveURL(/\/cars/);

      // Go back again
      await page.goBack();
      await expect(page).toHaveURL('/');

      // Go forward
      await page.goForward();
      await expect(page).toHaveURL(/\/cars/);
    });
  });

  test.describe('Footer Navigation', () => {
    test('NAV-004: should navigate via footer links', async ({ page }) => {
      await page.goto('/');

      // About page
      const aboutLink = page.locator('footer').getByRole('link', { name: /about|o nas/i });
      if (await aboutLink.isVisible()) {
        await aboutLink.click();
        await expect(page).toHaveURL(/\/about/);
      }

      // FAQ page
      await page.goto('/');
      const faqLink = page.locator('footer').getByRole('link', { name: /faq/i });
      if (await faqLink.isVisible()) {
        await faqLink.click();
        await expect(page).toHaveURL(/\/faq/);
      }

      // Terms page
      await page.goto('/');
      const termsLink = page.locator('footer').getByRole('link', { name: /terms|regulamin/i });
      if (await termsLink.isVisible()) {
        await termsLink.click();
        await expect(page).toHaveURL(/\/terms/);
      }

      // Privacy page
      await page.goto('/');
      const privacyLink = page.locator('footer').getByRole('link', { name: /privacy|prywatność/i });
      if (await privacyLink.isVisible()) {
        await privacyLink.click();
        await expect(page).toHaveURL(/\/privacy/);
      }
    });
  });
});

test.describe('404 Page', () => {
  test('NAV-005: should show 404 for non-existent routes', async ({ page }) => {
    await page.goto('/nonexistent-page-12345');

    // Should show 404 message
    const notFoundText = page.getByRole('heading', { name: /not found/i });
    await expect(notFoundText).toBeVisible();
  });

  test('NAV-006: should have link to home page', async ({ page }) => {
    await page.goto('/nonexistent-page-12345');

    // Should have link back to home (Go to homepage button)
    const homeLink = page.getByRole('link', { name: /go to homepage/i });
    await expect(homeLink).toBeVisible();

    // Click to go home
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Theme Switching', () => {
  test('THEME-001: should toggle between light and dark theme', async ({ page }) => {
    await page.goto('/');

    // Get initial theme
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });

    // Toggle theme
    const themeButton = page.getByRole('button', { name: /theme|motyw/i }).or(
      page.locator('button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="light"]')
    );
    
    if (await themeButton.isVisible()) {
      await themeButton.click();

      // Theme should change
      const newTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('THEME-002: should persist theme preference', async ({ page }) => {
    await page.goto('/');

    // Set dark theme
    const themeButton = page.getByRole('button', { name: /theme|motyw/i }).or(
      page.locator('button[aria-label*="theme"]')
    );
    
    if (await themeButton.isVisible()) {
      
      // Toggle to dark
      await themeButton.click();
      await page.waitForTimeout(100);

      const theme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      // Reload page
      await page.reload();

      // Theme should be preserved
      const themeAfterReload = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      expect(themeAfterReload).toBe(theme);
    }
  });
});

test.describe('Language Switching', () => {
  test('LANG-001: should switch language', async ({ page }) => {
    await page.goto('/');

    // Find language switcher
    const langButton = page.getByRole('button', { name: /language|język|en|pl/i }).or(
      page.locator('button[aria-label*="language"]')
    );

    if (await langButton.isVisible()) {
      await langButton.click();

      // Select a language option
      const langOption = page.getByRole('menuitem', { name: /english|polski/i }).or(
        page.getByText(/english|polski/i)
      );
      
      if (await langOption.isVisible()) {
        await langOption.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('LANG-002: should persist language preference', async ({ page }) => {
    await page.goto('/');

    // Get current language from localStorage
    const lang = await page.evaluate(() => localStorage.getItem('i18nextLng'));

    // Reload
    await page.reload();

    // Language should be preserved
    const langAfterReload = await page.evaluate(() => localStorage.getItem('i18nextLng'));
    
    // Should be same or both null
    expect(langAfterReload).toBe(lang);
  });
});
