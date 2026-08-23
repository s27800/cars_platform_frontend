import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';


/**
 * Car Details Page Object
 */
export class CarDetailsPage extends BasePage {


  // ============ LOCATORS ============

  /** Car name/title */
  get carTitle(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  /** Image gallery */
  get imageGallery(): Locator {
    return this.page.locator('.swiper, [class*="gallery"], [class*="carousel"]').first();
  }

  /** Main image */
  get mainImage(): Locator {
    return this.page.locator('main img').first();
  }

  /** Gallery thumbnails */
  get thumbnails(): Locator {
    return this.page.locator('.swiper-slide img, [class*="thumbnail"] img');
  }

  /** Gallery navigation - next */
  get galleryNext(): Locator {
    return this.page.locator('.swiper-button-next, [aria-label*="next"]');
  }

  /** Gallery navigation - previous */
  get galleryPrev(): Locator {
    return this.page.locator('.swiper-button-prev, [aria-label*="prev"]');
  }

  /** Specifications section */
  get specificationsSection(): Locator {
    return this.page.locator('section').filter({ hasText: /technical specifications|specyfikacja/i });
  }

  /** Engine specs */
  get engineSpecs(): Locator {
    return this.page.getByText(/engine|silnik/i).locator('..');
  }

  /** Add to comparison button */
  get addToComparisonButton(): Locator {
    return this.page.getByRole('button', { name: /add to comparison|remove from comparison|porównaj|usuń z porównania/i });
  }

  /** Like button */
  get likeButton(): Locator {
    return this.page.locator('button').filter({ has: this.page.locator('svg[class*="heart"], [class*="like"]') });
  }

  /** Reviews tab button */
  get reviewsTab(): Locator {
    return this.page.getByRole('tab', { name: /^reviews$/i });
  }

  /** Fuel reports tab button */
  get fuelReportsTab(): Locator {
    return this.page.getByRole('tab', { name: /fuel reports/i });
  }

  /** Reviews section */
  get reviewsSection(): Locator {
    return this.page.locator('section').filter({ hasText: /reviews/i }).first();
  }

  /** Review items */
  get reviewItems(): Locator {
    return this.page.locator('article, [class*="review-item"], [class*="review-card"]');
  }

  /** Add review button */
  get addReviewButton(): Locator {
    return this.page.getByRole('button', { name: 'Add Review', exact: true });
  }

  /** Average rating */
  get averageRating(): Locator {
    return this.page.locator('[class*="rating"], [class*="stars"]').first();
  }

  /** Fuel reports section */
  get fuelReportsSection(): Locator {
    return this.page.locator('section').filter({ hasText: /fuel reports/i });
  }

  /** Add fuel report button */
  get addFuelReportButton(): Locator {
    return this.page.getByRole('button', { name: /add report/i }).first();
  }

  /** Average consumption */
  get averageConsumption(): Locator {
    return this.page.getByText(/average.*consumption|średnie.*zużycie/i).locator('..');
  }

  /** Breadcrumb navigation */
  get breadcrumbs(): Locator {
    return this.page.locator('nav[aria-label*="breadcrumb"], nav').filter({ hasText: '/' }).first();
  }

  /** Brand link */
  get brandLink(): Locator {
    return this.breadcrumbs.getByRole('link').first();
  }

  /** Model link */
  get modelLink(): Locator {
    return this.breadcrumbs.getByRole('link').nth(1);
  }

  /** Generation link */
  get generationLink(): Locator {
    return this.breadcrumbs.getByRole('link').nth(2);
  }

  /** Tabs container */
  get tabs(): Locator {
    return this.page.locator('[role="tablist"]');
  }


  // ============ ACTIONS ============

  async goto(carId: number): Promise<void> {
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
    await tab.scrollIntoViewIfNeeded();
    await tab.click();
  }

  async clickReviewsTab(): Promise<void> {
    await this.reviewsTab.scrollIntoViewIfNeeded();
    await this.reviewsTab.click();
  }

  async clickFuelReportsTab(): Promise<void> {
    await this.fuelReportsTab.scrollIntoViewIfNeeded();
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
