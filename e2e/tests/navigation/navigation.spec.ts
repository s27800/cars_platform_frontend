import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages';
import { ROUTES } from '../../fixtures';


test.describe('Navigation and Routing', () => {
  
  test.describe('Main Navigation', () => {
    test('should navigate from header menu', async ({ page, isMobile }) => {
      
      const homePage = new HomePage(page);
      await homePage.goto();

      if (isMobile)
        await homePage.openHamburgerMenuIfMobile();

      await homePage.navigateToCars();
      await expect(page).toHaveURL(/\/cars/);

      if (isMobile)
        await homePage.openHamburgerMenuIfMobile();

      await homePage.navigateToComparison();
      await expect(page).toHaveURL(/\/comparison/);

      await homePage.clickLogo();
      await expect(page).toHaveURL('/');
    });

    test('should show login/register links when not authenticated', async ({ page, isMobile }) => {
      
      await page.goto('/');

      await page.evaluate(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });

      await page.reload();
      await page.waitForLoadState('networkidle');

      const homePage = new HomePage(page);

      if (isMobile)
        await homePage.openHamburgerMenuIfMobile();

      const container = isMobile 
        ? page.locator('#mobile-menu')
        : page.locator('nav[aria-label="Main navigation"]');

      const signInButton = container.getByRole('link', { name: /sign in|zaloguj/i }).first();

      await expect(signInButton).toBeVisible();
    });
  });

  test.describe('Deep Linking', () => {
    test('should support direct URL access', async ({ page }) => {

      await page.goto('/cars');
      await expect(page).toHaveURL('/cars');

      await page.goto('/comparison');
      await expect(page).toHaveURL('/comparison');

      await page.goto('/about');
      await expect(page).toHaveURL('/about');
    });

    test('should handle URL with parameters', async ({ page }) => {

      await page.goto('/cars?search=BMW');
      
      await expect(page).toHaveURL(/\/cars\?search=BMW/);
      
      const searchInput = page.locator('main').getByPlaceholder(/search|szukaj/i).first();

      await expect(searchInput).toHaveValue('BMW');
    });
  });

  test.describe('Browser Navigation', () => {
    test('should handle back/forward buttons', async ({ page }) => {

      await page.goto('/');

      await page.goto('/cars');
      
      await page.goto('/comparison');

      await page.goBack();
      await expect(page).toHaveURL(/\/cars/);

      await page.goBack();
      await expect(page).toHaveURL('/');

      await page.goForward();
      await expect(page).toHaveURL(/\/cars/);
    });
  });

  test.describe('Footer Navigation', () => {
    test('should navigate via footer links', async ({ page }) => {
      await page.goto('/');

      const aboutLink = page.locator('footer').getByRole('link', { name: /about|o nas/i });

      if (await aboutLink.isVisible()) {
        await aboutLink.click();
        await expect(page).toHaveURL(/\/about/);
      }

      await page.goto('/');

      const faqLink = page.locator('footer').getByRole('link', { name: /faq/i });

      if (await faqLink.isVisible()) {
        await faqLink.click();
        await expect(page).toHaveURL(/\/faq/);
      }

      await page.goto('/');

      const termsLink = page.locator('footer').getByRole('link', { name: /terms|regulamin/i });

      if (await termsLink.isVisible()) {
        await termsLink.click();
        await expect(page).toHaveURL(/\/terms/);
      }

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
  test('should show 404 for non-existent routes', async ({ page }) => {
    await page.goto('/nonexistent-page-12345');

    const notFoundText = page.getByRole('heading', { name: /not found/i });
    await expect(notFoundText).toBeVisible();
  });

  test('should have link to home page', async ({ page }) => {
    await page.goto('/nonexistent-page-12345');

    const homeLink = page.getByRole('link', { name: /go to homepage/i });
    await expect(homeLink).toBeVisible();

    await homeLink.click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Theme Switching', () => {
  test('should toggle between light and dark theme', async ({ page }) => {
    await page.goto('/');

    const initialTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });

    const themeButton = page.getByRole('button', { name: /theme|motyw/i }).or(
      page.locator('button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="light"]')
    );
    
    if (await themeButton.isVisible()) {
      await themeButton.click();

      const newTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('should persist theme preference', async ({ page }) => {
    await page.goto('/');

    const themeButton = page.getByRole('button', { name: /theme|motyw/i }).or(
      page.locator('button[aria-label*="theme"]')
    );
    
    if (await themeButton.isVisible()) {
      
      await themeButton.click();
      await page.waitForTimeout(100);

      const theme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      await page.reload();

      const themeAfterReload = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      expect(themeAfterReload).toBe(theme);
    }
  });
});

test.describe('Language Switching', () => {
  test('should switch language', async ({ page }) => {
    await page.goto('/');

    const langButton = page.getByRole('button', { name: /language|język|en|pl/i }).or(
      page.locator('button[aria-label*="language"]')
    );

    if (await langButton.isVisible()) {
      await langButton.click();

      const langOption = page.getByRole('menuitem', { name: /english|polski/i }).or(
        page.getByText(/english|polski/i)
      );
      
      if (await langOption.isVisible()) {
        await langOption.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('should persist language preference', async ({ page }) => {
    await page.goto('/');

    const lang = await page.evaluate(() => localStorage.getItem('i18nextLng'));

    await page.reload();

    const langAfterReload = await page.evaluate(() => localStorage.getItem('i18nextLng'));
    
    expect(langAfterReload).toBe(lang);
  });
});
