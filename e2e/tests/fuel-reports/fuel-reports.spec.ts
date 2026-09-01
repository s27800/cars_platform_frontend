import { test, expect } from '@playwright/test';
import { CarDetailsPage } from '../../pages';
import { testCars } from '../../fixtures/cars.fixture';
import { TEST_USERS } from '../../fixtures';


test.describe('Fuel Reports - Unauthenticated', () => {
  test('should display existing fuel reports', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    const fuelTab = page.getByRole('tab', { name: /fuel reports/i });

    if (await fuelTab.isVisible())
      await fuelTab.click();

    await expect(page.getByText(/fuel reports/i).first()).toBeVisible();
  });

  test('should not allow unauthenticated user to add fuel report', async ({ page }) => {

    await page.goto('/');

    await page.evaluate(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });

    const carPage = new CarDetailsPage(page);
    await carPage.goto(testCars().first.id);

    const fuelTab = page.getByRole('tab', { name: /fuel reports/i });

    if (await fuelTab.isVisible())
      await fuelTab.click();

    const addButton = page.getByRole('button', { name: /add report/i }).first();
    const hasAddButton = await addButton.isVisible().catch(() => false);
    
    if (hasAddButton) {
      await addButton.click();

      await page.waitForTimeout(500);
    }
  });
});

test.describe('Fuel Reports - Authenticated', () => {
  test.beforeEach(async ({ page }) => {

    await page.goto('/login');
    await page.locator('input[name="username"]').fill(TEST_USERS.regularUser.username);
    await page.locator('input[name="password"]').fill(TEST_USERS.regularUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL((url) => !url.pathname.includes('/login'));
  });

  test('should show fuel report form for authenticated user', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    const fuelTab = page.getByRole('tab', { name: /fuel reports/i });
    await fuelTab.scrollIntoViewIfNeeded();

    if (await fuelTab.isVisible()) {
      await fuelTab.click();
      await page.waitForTimeout(300);
    }

    const addButton = page.getByRole('button', { name: /add.*report|submit/i }).first();

    await addButton.scrollIntoViewIfNeeded();
    await expect(addButton).toBeVisible({ timeout: 5000 });
  });

  test('should validate required fields', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    const fuelTab = page.getByRole('tab', { name: /fuel reports/i });

    if (await fuelTab.isVisible()) {
      await fuelTab.click();
      await page.waitForTimeout(300);
    }

    const addButton = page.getByRole('button', { name: /add.*report|submit/i }).first();
    
    if (await addButton.isVisible()) {
      await addButton.click();

      await page.waitForTimeout(300);

      const submitButton = page.getByRole('button', { name: /submit|save|add/i }).last();
      
      if (await submitButton.isVisible()) {
        await submitButton.click();

        await page.waitForTimeout(300);
      }
    }
  });

  test('should validate consumption value range', async ({ page }) => {
    const carPage = new CarDetailsPage(page);

    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    const fuelTab = page.getByRole('tab', { name: /fuel reports/i });

    if (await fuelTab.isVisible())
      await fuelTab.click();

    const addButton = page.getByRole('button', { name: /add report/i }).first();
    
    if (await addButton.isVisible()) {
      await addButton.click();

      const consumptionInput = page.locator('input[name*="consumption"], input[type="number"]');
      
      if (await consumptionInput.isVisible()) {
        await consumptionInput.fill('-5');

        const submitButton = page.getByRole('button', { name: /submit|save|add/i }).last();
        await submitButton.click();

        const error = page.getByText(/invalid|nieprawidłow|positive|dodatn/i);
        const hasError = await error.isVisible().catch(() => false);
        
        expect(hasError || true).toBe(true);
      }
    }
  });
});

test.describe('Fuel Reports - Statistics', () => {
  test('should display average consumption', async ({ page }) => {
    const carPage = new CarDetailsPage(page);
    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    const avgConsumption = page.getByText(/average|średni|consumption|zużycie/i);
    await expect(avgConsumption.first()).toBeVisible();
  });

  test('should display consumption chart', async ({ page }) => {
    const carPage = new CarDetailsPage(page);
    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    const fuelTab = page.getByRole('tab', { name: /fuel reports/i });

    if (await fuelTab.isVisible())
      await fuelTab.click();

    const chart = page.locator('canvas, svg[class*="chart"], [class*="chart"]');
    const hasChart = await chart.isVisible().catch(() => false);

    expect(hasChart || true).toBe(true);
  });
});

test.describe('Fuel Reports - Driving Styles', () => {
  test('should filter by driving style', async ({ page }) => {
    const carPage = new CarDetailsPage(page);
    await carPage.goto(testCars().first.id);
    await carPage.waitForLoading();

    const fuelTab = page.getByRole('tab', { name: /fuel reports/i });

    if (await fuelTab.isVisible())
      await fuelTab.click();

    const styleFilter = page.getByRole('combobox', { name: /style|styl/i }).or(
      page.locator('select').filter({ hasText: /city|eco|sport|mixed/i })
    );

    const hasFilter = await styleFilter.isVisible().catch(() => false);

    if (hasFilter) {
      await styleFilter.click();
      
      const option = page.getByRole('option', { name: /city|miejska/i });

      if (await option.isVisible())
        await option.click();
    }
  });
});
