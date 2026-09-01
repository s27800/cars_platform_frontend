import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';


/**
 * Admin Dashboard Page Object
 */
export class AdminDashboardPage extends BasePage {

  // ============ LOCATORS ============

  get pageTitle(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  get statsCards(): Locator {
    return this.page.locator('.grid').locator('div.rounded-2xl').filter({
      hasText: /Pending/i
    });
  }

  get pendingReviewsCard(): Locator {
    return this.page.locator('[data-testid="pending-reviews"]').or(
      this.page.getByText(/pending reviews|oczekujące recenzje/i).locator('..')
    );
  }

  get pendingFuelReportsCard(): Locator {
    return this.page.locator('[data-testid="pending-fuel-reports"]').or(
      this.page.getByText(/pending.*fuel|oczekujące.*spalania/i).locator('..')
    );
  }

  get pendingProposalsCard(): Locator {
    return this.page.locator('[data-testid="pending-proposals"]').or(
      this.page.getByText(/pending.*proposals|oczekujące.*propozycje/i).locator('..')
    );
  }

  get reviewsLink(): Locator {
    return this.page.getByRole('link', { name: /reviews|recenzje/i });
  }

  get fuelReportsLink(): Locator {
    return this.page.getByRole('link', { name: /fuel reports|raporty spalania/i });
  }

  get proposalsLink(): Locator {
    return this.page.getByRole('link', { name: /proposals|propozycje/i });
  }


  // ============ ADMIN REVIEWS PAGE ============

  get reviewsList(): Locator {
    return this.page.locator('.space-y-5, .space-y-4');
  }

  get reviewItems(): Locator {
    return this.page.locator('.rounded-2xl, .rounded-xl').filter({
      has: this.page.getByRole('button', { name: /approve|reject/i })
    });
  }

  get approveButtons(): Locator {
    return this.page.getByRole('button', { name: /approve|zatwierdź/i });
  }

  get rejectButtons(): Locator {
    return this.page.getByRole('button', { name: /reject|odrzuć/i });
  }


  // ============ ADMIN FUEL REPORTS PAGE ============

  get fuelReportsList(): Locator {
    return this.page.locator('.space-y-5, .space-y-4');
  }

  get fuelReportItems(): Locator {
    return this.page.locator('.rounded-2xl, .rounded-xl').filter({
      has: this.page.getByRole('button', { name: /approve|reject/i })
    });
  }


  // ============ ADMIN PROPOSALS PAGE ============

  get proposalsList(): Locator {
    return this.page.locator('.space-y-5, .space-y-4');
  }

  get proposalItems(): Locator {
    return this.page.locator('.rounded-2xl, .rounded-xl').filter({
      has: this.page.getByRole('button', { name: /approve|reject/i })
    });
  }


  // ============ COMMON ============

  get pagination(): Locator {
    return this.page.locator('[data-testid="pagination"], nav[aria-label*="pagination"]');
  }

  get emptyState(): Locator {
    return this.page.getByText(/no pending|brak oczekujących|empty/i);
  }


  // ============ ACTIONS ============

  async goto(): Promise<void> {
    await this.page.goto('/admin');
  }

  async gotoReviews(): Promise<void> {
    await this.page.goto('/admin/reviews');
  }

  async gotoFuelReports(): Promise<void> {
    await this.page.goto('/admin/fuel-reports');
  }

  async gotoProposals(): Promise<void> {
    await this.page.goto('/admin/proposals');
  }

  async clickReviewsLink(): Promise<void> {
    await this.reviewsLink.click();
  }

  async clickFuelReportsLink(): Promise<void> {
    await this.fuelReportsLink.click();
  }

  async clickProposalsLink(): Promise<void> {
    await this.proposalsLink.click();
  }

  async approveItem(index: number = 0): Promise<void> {
    await this.approveButtons.nth(index).click();
  }

  async rejectItem(index: number = 0): Promise<void> {
    await this.rejectButtons.nth(index).click();
  }

  async goToPage(pageNumber: number): Promise<void> {
    await this.pagination.getByRole('button', { name: pageNumber.toString() }).click();
  }

  
  // ============ ASSERTIONS ============

  async expectDashboardVisible(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.statsCards.first()).toBeVisible();
  }

  async expectUnauthorizedRedirect(): Promise<void> {
    await expect(this.page).toHaveURL(/\/(login)?$/);
  }

  async expectPendingReviewsCount(count: number): Promise<void> {
    await expect(this.pendingReviewsCard).toContainText(count.toString());
  }

  async expectReviewsListVisible(): Promise<void> {
    await expect(this.reviewsList).toBeVisible();
  }

  async expectReviewItemsCount(count: number): Promise<void> {
    await expect(this.reviewItems).toHaveCount(count);
  }

  async expectFuelReportsListVisible(): Promise<void> {
    await expect(this.fuelReportsList).toBeVisible();
  }

  async expectFuelReportItemsCount(count: number): Promise<void> {
    await expect(this.fuelReportItems).toHaveCount(count);
  }

  async expectProposalsListVisible(): Promise<void> {
    await expect(this.proposalsList).toBeVisible();
  }

  async expectProposalItemsCount(count: number): Promise<void> {
    await expect(this.proposalItems).toHaveCount(count);
  }

  async expectEmptyState(): Promise<void> {
    await expect(this.emptyState).toBeVisible();
  }

  async expectItemApproved(): Promise<void> {
    await expect(this.toast).toContainText(/approved|zatwierdzono|success/i);
  }

  async expectItemRejected(): Promise<void> {
    await expect(this.toast).toContainText(/rejected|odrzucono|success/i);
  }
}
