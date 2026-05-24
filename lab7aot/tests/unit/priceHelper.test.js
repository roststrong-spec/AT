import { parsePrice, isValidPrice, formatPrice, comparePrices } from '../../business/helpers/priceHelper.js';

describe('parsePrice', () => {
  test('парсить ціну з символом валюти £', () => {
    expect(parsePrice('£12.34')).toBe(12.34);
  });

  test('парсить ціну без символу валюти', () => {
    expect(parsePrice('12.34')).toBe(12.34);
  });

  test('парсить ціну Â£ (UTF-8 варіант)', () => {
    expect(parsePrice('Â£12.34')).toBe(12.34);
  });

  test('повертає NaN для порожнього рядка', () => {
    expect(Number.isNaN(parsePrice(''))).toBe(true);
  });

  test('парсить нульову ціну', () => {
    expect(parsePrice('£0.00')).toBe(0);
  });
});

describe('isValidPrice', () => {
  test('повертає true для додатної ціни', () => {
    expect(isValidPrice(10)).toBe(true);
  });

  test("повертає false для нуля", () => {
    expect(isValidPrice(0)).toBe(false);
  });

  test("повертає false для від'ємного", () => {
    expect(isValidPrice(-5)).toBe(false);
  });

  test('повертає false для рядка', () => {
    expect(isValidPrice('12')).toBe(false);
  });

  test('повертає true для цілого числа', () => {
    expect(isValidPrice(5)).toBe(true);
  });
});

describe('formatPrice', () => {
  test('форматує ціну з двома знаками', () => {
    expect(formatPrice(2.5)).toBe('£2.50');
  });

  test('форматує ціле число', () => {
    expect(formatPrice(3)).toBe('£3.00');
  });

  test('округляє до 2 знаків', () => {
    expect(formatPrice(2.345)).toBe('£2.35');
  });

  test('форматує нуль', () => {
    expect(formatPrice(0)).toBe('£0.00');
  });

  test('повертає рядок', () => {
    expect(typeof formatPrice(1.5)).toBe('string');
  });
});

describe('comparePrices', () => {
  test("повертає від'ємне для a < b", () => {
    expect(comparePrices(1, 2)).toBeLessThan(0);
  });

  test('повертає 0 для рівних цін', () => {
    expect(comparePrices(2, 2)).toBe(0);
  });

  test('повертає додатне для a > b', () => {
    expect(comparePrices(3, 2)).toBeGreaterThan(0);
  });

  test('сортує масив цін правильно', () => {
    expect([3, 1, 2].sort(comparePrices)).toEqual([1, 2, 3]);
  });

  test('працює з дробовими числами', () => {
    expect(comparePrices(1.5, 1.25)).toBeGreaterThan(0);
  });
});
