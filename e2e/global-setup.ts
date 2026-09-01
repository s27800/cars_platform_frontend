import { test as setup } from '@playwright/test';
import { TEST_USERS } from './fixtures/test-data.fixture';
import { ADMIN_AUTH_FILE, USER_AUTH_FILE } from './fixtures/auth.fixture';
import { MISSING_CAR_ID, TEST_CARS_FILE, writeTestCars } from './fixtures/cars.fixture';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * Global setup - runs before all tests
 */

const authDir = path.join(__dirname, '.auth');

if (!fs.existsSync(authDir))
  fs.mkdirSync(authDir, { recursive: true });

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login');

  await page.locator('input[name="username"]').fill(TEST_USERS.admin.username);
  await page.locator('input[name="password"]').fill(TEST_USERS.admin.password);

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });

  const token = await page.evaluate(() => localStorage.getItem('token'));

  if (!token)
    throw new Error('Admin login failed - no token found');

  await page.context().storageState({ path: ADMIN_AUTH_FILE });

  console.log('✓ Admin authentication state saved');
});

setup('authenticate as regular user', async ({ page }) => {
  await page.goto('/login');

  await page.locator('input[name="username"]').fill(TEST_USERS.regularUser.username);
  await page.locator('input[name="password"]').fill(TEST_USERS.regularUser.password);

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });

  const token = await page.evaluate(() => localStorage.getItem('token'));
  
  if (!token)
    throw new Error('User login failed - no token found');

  await page.context().storageState({ path: USER_AUTH_FILE });

  console.log('✓ Regular user authentication state saved');
});


const API_URL = process.env.E2E_API_URL ?? 'http://localhost:8080/api';

setup('resolve car ids from the API', async ({ request }) => {
  const response = await request.get(`${API_URL}/cars/search`, {
    params: { size: '5', sort: 'name,asc' },
  });

  if (!response.ok()) {
    throw new Error(
      `Could not reach ${API_URL}/cars/search (HTTP ${response.status()}). ` +
      'Start the backend and database before running E2E tests.'
    );
  }

  const content = (await response.json()).content ?? [];

  if (content.length < 5) {
    throw new Error(
      `The API returned ${content.length} car(s); the E2E suite needs at least 5. ` +
      'Load docker/init/02-test-data.sql into the database.'
    );
  }

  const pick = (car: { id: string; name: string }) => ({ id: car.id, name: car.name });

  writeTestCars({
    first: pick(content[0]),
    second: pick(content[1]),
    third: pick(content[2]),
    all: content.map(pick),
    missing: MISSING_CAR_ID,
  });

  console.log(`✓ Resolved test car ids -> ${TEST_CARS_FILE}`);
});
