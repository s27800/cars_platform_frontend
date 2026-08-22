import { test as setup } from '@playwright/test';
import { TEST_USERS } from './fixtures/test-data.fixture';
import { ADMIN_AUTH_FILE, USER_AUTH_FILE } from './fixtures/auth.fixture';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * Global setup - runs before all tests
 */

// Ensure auth directory exists
const authDir = path.join(__dirname, '.auth');

if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

setup('authenticate as admin', async ({ page }) => {

  // Navigate to login page
  await page.goto('/login');

  // Fill login form
  await page.locator('input[name="username"]').fill(TEST_USERS.admin.username);
  await page.locator('input[name="password"]').fill(TEST_USERS.admin.password);

  // Submit form
  await page.getByRole('button', { name: /sign in/i }).click();

  // Wait for successful login
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });

  // Verify login was successful
  const token = await page.evaluate(() => localStorage.getItem('token'));

  if (!token) {
    throw new Error('Admin login failed - no token found');
  }

  // Save authentication state
  await page.context().storageState({ path: ADMIN_AUTH_FILE });

  console.log('✓ Admin authentication state saved');
});

setup('authenticate as regular user', async ({ page }) => {

  // Navigate to login page
  await page.goto('/login');

  // Fill login form
  await page.locator('input[name="username"]').fill(TEST_USERS.regularUser.username);
  await page.locator('input[name="password"]').fill(TEST_USERS.regularUser.password);

  // Submit form
  await page.getByRole('button', { name: /sign in/i }).click();

  // Wait for successful login
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });

  // Verify login was successful
  const token = await page.evaluate(() => localStorage.getItem('token'));
  
  if (!token) {
    throw new Error('User login failed - no token found');
  }

  // Save authentication state
  await page.context().storageState({ path: USER_AUTH_FILE });

  console.log('✓ Regular user authentication state saved');
});
