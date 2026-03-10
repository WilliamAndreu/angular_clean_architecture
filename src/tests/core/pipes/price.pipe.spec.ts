import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { PricePipe } from 'src/core/pipes/price.pipe';

describe('PricePipe', () => {
  let pipe: PricePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), PricePipe],
    });
    pipe = TestBed.inject(PricePipe);
  });

  it('formats integer price', () => {
    expect(pipe.transform(10)).toBe('$10.00');
  });

  it('formats decimal price with 2 decimals', () => {
    expect(pipe.transform(9.99)).toBe('$9.99');
  });

  it('formats zero', () => {
    expect(pipe.transform(0)).toBe('$0.00');
  });

  it('rounds to 2 decimal places', () => {
    expect(pipe.transform(1.999)).toBe('$2.00');
  });

  it('formats negative price', () => {
    expect(pipe.transform(-5.5)).toBe('$-5.50');
  });

  it('formats large price', () => {
    expect(pipe.transform(1999.99)).toBe('$1999.99');
  });

  it('formats price with trailing zero', () => {
    expect(pipe.transform(10.1)).toBe('$10.10');
  });

  it('always returns a string starting with $', () => {
    expect(pipe.transform(42).startsWith('$')).toBe(true);
  });
});
