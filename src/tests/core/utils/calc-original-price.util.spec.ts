import { describe, it, expect } from 'vitest';
import { calcOriginalPrice } from 'src/core/utils/calc-original-price.util';

describe('calcOriginalPrice', () => {
  it('calculates original price from 10% discount', () => {
    const result = calcOriginalPrice(90, 10);
    expect(result).toBeCloseTo(100, 2);
  });

  it('calculates original price from 50% discount', () => {
    const result = calcOriginalPrice(50, 50);
    expect(result).toBeCloseTo(100, 2);
  });

  it('returns same price for 0% discount', () => {
    const result = calcOriginalPrice(100, 0);
    expect(result).toBe(100);
  });

  it('handles fractional discounts', () => {
    const result = calcOriginalPrice(76, 24);
    expect(result).toBeCloseTo(100, 1);
  });
});
