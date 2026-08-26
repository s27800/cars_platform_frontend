import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  formatDate,
  calculateAverage,
  getConsumptionLevel,
  getCarDisplayName,
  getStorageItem,
  setStorageItem,
} from '../helpers';


describe('helpers', () => {
  
  // ==================== formatDate ====================
  describe('formatDate', () => {
    it('should format date string to "DD MMM YYYY" format', () => {
      const result = formatDate('2024-01-15T10:30:00');
      expect(result).toBe('15 Jan 2024');
    });

    it('should return empty string for null input', () => {
      expect(formatDate(null)).toBe('');
    });

    it('should return empty string for undefined input', () => {
      expect(formatDate(undefined)).toBe('');
    });

    it('should return empty string for empty string input', () => {
      expect(formatDate('')).toBe('');
    });

    it('should handle ISO date format', () => {
      const result = formatDate('2023-12-25');
      expect(result).toContain('Dec');
      expect(result).toContain('2023');
    });
  });


  // ==================== calculateAverage ====================
  describe('calculateAverage', () => {
    it('should calculate average of numbers', () => {
      expect(calculateAverage([10, 20, 30])).toBe(20);
    });

    it('should return 0 for empty array', () => {
      expect(calculateAverage([])).toBe(0);
    });

    it('should ignore null values', () => {
      expect(calculateAverage([10, null, 30])).toBe(20);
    });

    it('should ignore undefined values', () => {
      expect(calculateAverage([10, undefined, 20])).toBe(15);
    });

    it('should return 0 if all values are null/undefined', () => {
      expect(calculateAverage([null, undefined, null])).toBe(0);
    });

    it('should handle single value', () => {
      expect(calculateAverage([42])).toBe(42);
    });

    it('should handle decimal values', () => {
      const result = calculateAverage([5.5, 7.5]);
      expect(result).toBe(6.5);
    });
  });


  // ==================== getConsumptionLevel ====================
  describe('getConsumptionLevel', () => {
    it('should return "Very economical" for consumption <= 5', () => {
      const result = getConsumptionLevel(4.5);
      expect(result.label).toBe('Very economical');
      expect(result.variant).toBe('success');
    });

    it('should return "Economical" for consumption <= 7', () => {
      const result = getConsumptionLevel(6);
      expect(result.label).toBe('Economical');
      expect(result.variant).toBe('success');
    });

    it('should return "Average" for consumption <= 10', () => {
      const result = getConsumptionLevel(8);
      expect(result.label).toBe('Average');
      expect(result.variant).toBe('warning');
    });

    it('should return "Above average" for consumption <= 13', () => {
      const result = getConsumptionLevel(12);
      expect(result.label).toBe('Above average');
      expect(result.variant).toBe('warning');
    });

    it('should return "High consumption" for consumption > 13', () => {
      const result = getConsumptionLevel(15);
      expect(result.label).toBe('High consumption');
      expect(result.variant).toBe('danger');
    });

    it('should handle string input', () => {
      const result = getConsumptionLevel('5.5');
      expect(result.label).toBe('Economical');
    });

    it('should handle boundary value 5', () => {
      const result = getConsumptionLevel(5);
      expect(result.label).toBe('Very economical');
    });

    it('should handle boundary value 7', () => {
      const result = getConsumptionLevel(7);
      expect(result.label).toBe('Economical');
    });
  });


  // ==================== getCarDisplayName ====================
  describe('getCarDisplayName', () => {
    it('should return car.name if available', () => {
      const car = { name: 'BMW M3 Competition' };
      expect(getCarDisplayName(car)).toBe('BMW M3 Competition');
    });

    it('should return empty string for null input', () => {
      expect(getCarDisplayName(null)).toBe('');
    });

    it('should return empty string for undefined input', () => {
      expect(getCarDisplayName(undefined)).toBe('');
    });

    it('should construct name from brand, model, generation', () => {
      const car = {
        brand: { name: 'BMW' },
        model: { name: '3 Series' },
        generation: { name: 'G20' },
      };
      expect(getCarDisplayName(car)).toBe('BMW 3 Series G20');
    });

    it('should handle missing brand', () => {
      const car = {
        model: { name: '3 Series' },
        generation: { name: 'G20' },
      };
      expect(getCarDisplayName(car)).toBe('3 Series G20');
    });

    it('should handle missing model', () => {
      const car = {
        brand: { name: 'BMW' },
        generation: { name: 'G20' },
      };
      expect(getCarDisplayName(car)).toBe('BMW  G20');
    });

    it('should return "Unknown Car" if no data available', () => {
      const car = {};
      expect(getCarDisplayName(car)).toBe('Unknown Car');
    });

    it('should prefer car.name over constructed name', () => {
      const car = {
        name: 'Custom Name',
        brand: { name: 'BMW' },
        model: { name: '3 Series' },
      };
      expect(getCarDisplayName(car)).toBe('Custom Name');
    });
  });


  // ==================== getStorageItem / setStorageItem ====================
  describe('localStorage utilities', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    describe('getStorageItem', () => {
      it('should return parsed JSON from localStorage', () => {
        localStorage.getItem.mockReturnValue(JSON.stringify({ test: 'value' }));
        
        const result = getStorageItem('testKey');
        expect(result).toEqual({ test: 'value' });
        expect(localStorage.getItem).toHaveBeenCalledWith('testKey');
      });

      it('should return default value if key not found', () => {
        localStorage.getItem.mockReturnValue(null);
        
        const result = getStorageItem('missingKey', 'default');
        expect(result).toBe('default');
      });

      it('should return default value on parse error', () => {
        localStorage.getItem.mockReturnValue('invalid json');
        
        const result = getStorageItem('badKey', 'fallback');
        expect(result).toBe('fallback');
      });

      it('should return null as default if not specified', () => {
        localStorage.getItem.mockReturnValue(null);
        
        const result = getStorageItem('missingKey');
        expect(result).toBeNull();
      });
    });

    describe('setStorageItem', () => {
      it('should stringify and save value to localStorage', () => {
        setStorageItem('testKey', { test: 'value' });
        
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'testKey',
          JSON.stringify({ test: 'value' })
        );
      });

      it('should handle array values', () => {
        setStorageItem('arrayKey', [1, 2, 3]);
        
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'arrayKey',
          JSON.stringify([1, 2, 3])
        );
      });

      it('should not throw on localStorage error', () => {
        localStorage.setItem.mockImplementation(() => {
          throw new Error('QuotaExceeded');
        });
        
        expect(() => setStorageItem('key', 'value')).not.toThrow();
      });
    });
  });
});
