import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages';


test.describe('Language Switcher', () => {
  
  test.describe('Language Selection', () => {
    test('should switch language to Polish', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      await homePage.changeLanguage('pl');

      await expect(page.getByText('idealny samochód')).toBeVisible({ timeout: 5000 });
    });

    test('should switch language to English', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      await homePage.changeLanguage('pl');
      await page.waitForLoadState('networkidle');

      await homePage.changeLanguage('en');

      await expect(page.getByText('perfect car')).toBeVisible({ timeout: 5000 });
    });

    test('should persist language selection after page reload', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      await homePage.changeLanguage('pl');
      await page.waitForLoadState('networkidle');

      await page.reload();
      await page.waitForLoadState('networkidle');

      await expect(page.getByText('idealny samochód')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Language Switcher UI', () => {
    test('should display language switcher button', async ({ page, isMobile }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      if (isMobile)
        await homePage.openHamburgerMenuIfMobile();

      const languageButton = page.getByRole('button', { name: /language|język/i });
      await expect(languageButton).toBeVisible();
    });

    test('should show language options when clicking language button', async ({ page, isMobile }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      if (isMobile)
        await homePage.openHamburgerMenuIfMobile();

      const languageButton = page.getByRole('button', { name: /language|język/i });
      await languageButton.click();

      await expect(page.getByRole('option', { name: /english/i })).toBeVisible();
      await expect(page.getByRole('option', { name: /polski/i })).toBeVisible();
    });
  });
});
