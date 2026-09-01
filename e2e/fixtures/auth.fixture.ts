import { test as base, Page, BrowserContext } from '@playwright/test';
import { TEST_USERS } from './test-data.fixture';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTH_DIR = path.join(__dirname, '../.auth');

export const ADMIN_AUTH_FILE = path.join(AUTH_DIR, 'admin.json');
export const USER_AUTH_FILE = path.join(AUTH_DIR, 'user.json');


/**
 * Custom test fixtures for authentication
 */
type AuthFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
  unauthenticatedPage: Page;
};


/**
 * Extended test with authentication fixtures
 */
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: USER_AUTH_FILE,
    });

    const page = await context.newPage();

    await use(page);
    await context.close();
  },

  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: ADMIN_AUTH_FILE,
    });

    const page = await context.newPage();

    await use(page);
    await context.close();
  },

  unauthenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await use(page);
    await context.close();
  },
});


export { expect } from '@playwright/test';


/**
 * Helper functions
 */

export async function loginViaUI(
  page: Page,
  username: string,
  password: string
): Promise<void> {
  await page.goto('/login');
  await page.getByLabel(/username/i).fill(username);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'));
}


export async function logoutViaUI(page: Page): Promise<void> {
  await page.getByRole('button', { name: /user menu|menu użytkownika/i }).click();
  await page.getByRole('menuitem', { name: /logout|wyloguj/i }).click();
  await page.waitForURL('/');
}


export async function isLoggedIn(page: Page): Promise<boolean> {
  const userMenu = page.getByRole('button', { name: /user menu|menu użytkownika/i });
  return await userMenu.isVisible().catch(() => false);
}


export async function getCurrentUser(page: Page): Promise<any | null> {
  return await page.evaluate(() => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  });
}


export async function clearAuthState(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
  });
}
