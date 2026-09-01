import { describe, it, expect } from 'vitest';
import {
  DEFAULT_PAGE_SIZE,
  REVIEWS_PAGE_SIZE,
  FUEL_REPORTS_PAGE_SIZE,
  PROPOSALS_PAGE_SIZE,
  STALE_TIME,
  STORAGE_KEYS,
} from '../constants';


describe('constants', () => {
  describe('pagination constants', () => {
    it('should have default page size of 10', () => {
      expect(DEFAULT_PAGE_SIZE).toBe(10);
    });

    it('should have reviews page size of 5', () => {
      expect(REVIEWS_PAGE_SIZE).toBe(5);
    });

    it('should have fuel reports page size of 5', () => {
      expect(FUEL_REPORTS_PAGE_SIZE).toBe(5);
    });

    it('should have proposals page size of 5', () => {
      expect(PROPOSALS_PAGE_SIZE).toBe(5);
    });
  });

  describe('stale times', () => {
    it('should be ordered from shortest to longest', () => {
      expect(STALE_TIME.SHORT).toBeLessThan(STALE_TIME.MEDIUM);
      expect(STALE_TIME.MEDIUM).toBeLessThan(STALE_TIME.LONG);
    });

    it('should be expressed in milliseconds', () => {
      expect(STALE_TIME.SHORT).toBe(30 * 1000);
      expect(STALE_TIME.LONG).toBe(5 * 60 * 1000);
    });
  });

  describe('storage keys', () => {
    it('should cover every key the app writes to localStorage', () => {
      expect(STORAGE_KEYS).toEqual({
        TOKEN: 'token',
        USER: 'user',
        TOKEN_EXPIRY: 'tokenExpiry',
        THEME: 'theme',
        LANGUAGE: 'language',
        COMPARISON_CARS: 'comparisonCars',
      });
    });

    it('should not reuse a value for two different keys', () => {
      const values = Object.values(STORAGE_KEYS);
      expect(new Set(values).size).toBe(values.length);
    });
  });
});
