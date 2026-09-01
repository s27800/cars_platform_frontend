import { describe, it, expect } from 'vitest';
import { RATING_CATEGORIES } from '../ratingCategories';


describe('RATING_CATEGORIES', () => {
  it('should have 11 rating categories', () => {
    expect(RATING_CATEGORIES).toHaveLength(11);
  });

  it('should have required properties for each category', () => {
    RATING_CATEGORIES.forEach(category => {
      expect(category).toHaveProperty('key');
      expect(category).toHaveProperty('labelKey');
      expect(category).toHaveProperty('descKey');
    });
  });

  it('should have unique keys', () => {
    const keys = RATING_CATEGORIES.map(c => c.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('should include engineRating', () => {
    const engineCategory = RATING_CATEGORIES.find(c => c.key === 'engineRating');
    expect(engineCategory).toBeDefined();
    expect(engineCategory.labelKey).toBe('engine');
  });
});
