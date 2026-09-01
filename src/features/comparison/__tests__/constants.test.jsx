import { describe, it, expect } from 'vitest';
import { MAX_COMPARISON_CARS } from '../constants';


describe('MAX_COMPARISON_CARS', () => {
  it('should allow maximum 4 cars in comparison', () => {
    expect(MAX_COMPARISON_CARS).toBe(4);
  });
});
