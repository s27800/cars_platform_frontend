import { describe, it, expect } from 'vitest';
import {
  RATING_CATEGORIES,
  PROPOSAL_CATEGORIES,
  DEFAULT_PAGE_SIZE,
  REVIEWS_PAGE_SIZE,
  FUEL_REPORTS_PAGE_SIZE,
  MAX_COMPARISON_CARS,
  STORAGE_KEYS,
} from '../constants';


describe('constants', () => {
  describe('RATING_CATEGORIES', () => {
    it('should have 11 rating categories', () => {
      expect(RATING_CATEGORIES).toHaveLength(11);
    });

    it('should have required properties for each category', () => {
      RATING_CATEGORIES.forEach(category => {
        expect(category).toHaveProperty('key');
        expect(category).toHaveProperty('label');
        expect(category).toHaveProperty('description');
      });
    });

    it('should have unique keys', () => {
      const keys = RATING_CATEGORIES.map(c => c.key);
      const uniqueKeys = [...new Set(keys)];
      expect(keys).toHaveLength(uniqueKeys.length);
    });

    it('should include engineRating', () => {
      const engineCategory = RATING_CATEGORIES.find(c => c.key === 'engineRating');
      expect(engineCategory).toBeDefined();
      expect(engineCategory.label).toBe('Engine');
    });
  });

  describe('PROPOSAL_CATEGORIES', () => {
    it('should have 8 proposal categories', () => {
      expect(PROPOSAL_CATEGORIES).toHaveLength(8);
    });

    it('should have value and label for each category', () => {
      PROPOSAL_CATEGORIES.forEach(category => {
        expect(category).toHaveProperty('value');
        expect(category).toHaveProperty('label');
      });
    });

    it('should include ENGINE category', () => {
      const engineCategory = PROPOSAL_CATEGORIES.find(c => c.value === 'ENGINE');
      expect(engineCategory).toBeDefined();
      expect(engineCategory.label).toBe('Engine');
    });
  });

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
  });

  describe('comparison limit', () => {
    it('should allow maximum 4 cars in comparison', () => {
      expect(MAX_COMPARISON_CARS).toBe(4);
    });
  });

  describe('storage keys', () => {
    it('should have comparison cars key', () => {
      expect(STORAGE_KEYS.COMPARISON_CARS).toBe('comparisonCars');
    });

    it('should have theme key', () => {
      expect(STORAGE_KEYS.THEME).toBe('theme');
    });
  });
});
