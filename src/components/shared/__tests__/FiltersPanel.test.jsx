import { describe, it, expect } from 'vitest';
import FiltersPanel from '../FiltersPanel';


describe('FiltersPanel', () => {
  describe('module', () => {
    it('should export FiltersPanel component', () => {
      expect(FiltersPanel).toBeDefined();
      expect(typeof FiltersPanel).toBe('function');
    });
  });
});
