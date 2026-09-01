import { describe, it, expect, vi } from 'vitest';
import { PROPOSAL_CATEGORIES, CATEGORY_FIELDS, getProposalCategoryLabel } from '../categories';


describe('PROPOSAL_CATEGORIES', () => {
  it('should have 8 proposal categories', () => {
    expect(PROPOSAL_CATEGORIES).toHaveLength(8);
  });

  it('should have a value and a label key for each category', () => {
    PROPOSAL_CATEGORIES.forEach(category => {
      expect(category).toHaveProperty('value');
      expect(category).toHaveProperty('labelKey');
    });
  });

  it('should include the ENGINE category', () => {
    const engine = PROPOSAL_CATEGORIES.find(c => c.value === 'ENGINE');
    expect(engine).toBeDefined();
    expect(engine.labelKey).toBe('engine');
  });

  it('should have a field list for every category', () => {
    PROPOSAL_CATEGORIES.forEach(category => {
      expect(CATEGORY_FIELDS[category.value]).toBeInstanceOf(Array);
    });
  });

  it('should leave TAGS without plain input fields', () => {
    expect(CATEGORY_FIELDS.TAGS).toEqual([]);
  });
});


describe('getProposalCategoryLabel', () => {
  it('should translate a known category', () => {
    const t = vi.fn(key => key);
    expect(getProposalCategoryLabel('TRANSMISSION', t))
      .toBe('cars:dataProposal.categories.transmission');
  });

  it('should fall back to the raw value for an unknown category', () => {
    const t = vi.fn(key => key);
    expect(getProposalCategoryLabel('SOMETHING_NEW', t)).toBe('SOMETHING_NEW');
    expect(t).not.toHaveBeenCalled();
  });
});
