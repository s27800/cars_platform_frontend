import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';


/**
 * Car Details Page Object
 */
export class CarDetailsPage extends BasePage {


  // ============ LOCATORS ============

  get carTitle(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  get imageGallery(): Locator {
    return this.page.locator('.swiper, [class*="gallery"], [class*="carousel"]').first();
  }

  get mainImage(): Locator {
    return this.page.locator('main img').first();
  }

  get thumbnails(): Locator {
    return this.page.locator('.swiper-slide img, [class*="thumbnail"] img');
  }

  get galleryNext(): Locator {
    return this.page.locator('.swiper-button-next, [aria-label*="next"]');
  }

  get galleryPrev(): Locator {
    return this.page.locator('.swiper-button-prev, [aria-label*="prev"]');
  }

  get specificationsSection(): Locator {
    return this.page.locator('section').filter({ hasText: /technical specifications|specyfikacja/i });
  }

  get engineSpecs(): Locator {
    return this.page.getByText(/engine|silnik/i).locator('..');
  }

  get addToComparisonButton(): Locator {
    return this.page.getByRole('button', { name: /add to comparison|remove from comparison|porównaj|usuń z porównania/i });
  }

  get likeButton(): Locator {
    return this.page.locator('button').filter({ has: this.page.locator('svg[class*="heart"], [class*="like"]') });
  }

  get reviewsTab(): Locator {
    return this.page.getByRole('tab', { name: /^reviews$/i });
  }

  get fuelReportsTab(): Locator {
    return this.page.getByRole('tab', { name: /fuel reports/i });
  }

  get reviewsSection(): Locator {
    return this.page.locator('section').filter({ hasText: /reviews/i }).first();
  }

  get reviewItems(): Locator {
    return this.page.locator('article, [class*="review-item"], [class*="review-card"]');
  }

  get addReviewButton(): Locator {
    return this.page.getByRole('button', { name: 'Write a review', exact: true }).first();
  }

  get averageRating(): Locator {
    return this.page.locator('[class*="rating"], [class*="stars"]').first();
  }

  get fuelReportsSection(): Locator {
    return this.page.locator('section').filter({ hasText: /fuel reports/i });
  }

  get addFuelReportButton(): Locator {
    return this.page.getByRole('button', { name: /add report/i }).first();
  }

  get averageConsumption(): Locator {
    return this.page.getByText(/average.*consumption|średnie.*zużycie/i).locator('..');
  }

  get breadcrumbs(): Locator {
    return this.page.locator('nav[aria-label*="breadcrumb"], nav').filter({ hasText: '/' }).first();
  }

  get brandLink(): Locator {
    return this.breadcrumbs.locator('a[href^="/brands/"]').first();
  }

  get modelLink(): Locator {
    return this.breadcrumbs.locator('a[href^="/models/"]').first();
  }

  get generationLink(): Locator {
    return this.breadcrumbs.locator('a[href^="/generations/"]').first();
  }

  get tabs(): Locator {
    return this.page.locator('[role="tablist"]');
  }


  // ============ ACTIONS ============

  async goto(carId: string): Promise<void> {
    await this.page.goto(`/cars/${carId}`);
  }

  async clickNextImage(): Promise<void> {
    await this.galleryNext.click();
  }

  async clickPrevImage(): Promise<void> {
    await this.galleryPrev.click();
  }

  async clickThumbnail(index: number): Promise<void> {
    await this.thumbnails.nth(index).click();
  }

  async addToComparison(): Promise<void> {
    await this.addToComparisonButton.click();
  }

  async clickLike(): Promise<void> {
    await this.likeButton.click();
  }

  async clickAddReview(): Promise<void> {
    await this.addReviewButton.click();
  }

  async clickAddFuelReport(): Promise<void> {
    await this.addFuelReportButton.click();
  }

  async clickBrandLink(): Promise<void> {
    await this.brandLink.click();
  }

  async clickModelLink(): Promise<void> {
    await this.modelLink.click();
  }

  async selectTab(tabName: string): Promise<void> {
    const tab = this.page.getByRole('tab', { name: new RegExp(tabName, 'i') });
    await tab.waitFor({ state: 'visible' });
    await tab.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await tab.click();
  }

  async clickReviewsTab(): Promise<void> {
    await this.reviewsTab.waitFor({ state: 'visible' });
    await this.reviewsTab.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await this.reviewsTab.click();
  }

  async clickFuelReportsTab(): Promise<void> {
    await this.fuelReportsTab.waitFor({ state: 'visible' });
    await this.fuelReportsTab.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await this.fuelReportsTab.click();
  }


  // ============ ASSERTIONS ============

  async expectPageVisible(): Promise<void> {
    await expect(this.carTitle).toBeVisible();
  }

  async expectCarTitle(title: string): Promise<void> {
    await expect(this.carTitle).toContainText(title);
  }

  async expectImageGalleryVisible(): Promise<void> {
    await expect(this.mainImage).toBeVisible();
  }

  async expectSpecificationsVisible(): Promise<void> {
    await expect(this.page.getByText(/technical specifications/i)).toBeVisible();
  }

  async expectReviewsSection(): Promise<void> {
    await this.reviewsTab.click();
    await expect(this.page.getByText(/reviews/i).first()).toBeVisible();
  }

  async expectReviewCount(count: number): Promise<void> {
    await expect(this.reviewItems).toHaveCount(count);
  }

  async expectAddedToComparison(): Promise<void> {
    await expect(
      this.page.getByRole('button', { name: /remove from comparison|usuń z porównania/i })
    ).toBeVisible();
  }

  async expectLiked(): Promise<void> {
    await expect(this.likeButton).toHaveClass(/active|liked|filled/);
  }

  async expectBreadcrumbsVisible(): Promise<void> {
    await expect(this.breadcrumbs).toBeVisible();
  }

  async expectFuelReportsSection(): Promise<void> {
    await this.fuelReportsTab.click();
    await expect(this.page.getByText(/fuel reports/i).first()).toBeVisible();
  }

  async expectNotFound(): Promise<void> {
    await expect(this.page.getByText(/not found|nie znaleziono|404/i).first()).toBeVisible();
  }
}
