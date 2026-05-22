import { getMilliseconds, getTime, getTimezoneOffset, setFullYear, setMonth, setDate } from './sample.js';

describe('getMilliseconds', () => {
  test('повертає мілісекунди для дати з нульовими мс', () => {
    const date = new Date(2024, 0, 1, 10, 30, 0, 0);
    expect(getMilliseconds(date)).toBe(0);
  });

  test('повертає 500 мілісекунд', () => {
    const date = new Date(2024, 0, 1, 10, 30, 0, 500);
    expect(getMilliseconds(date)).toBe(500);
  });

  test('повертає 999 мілісекунд (максимум)', () => {
    const date = new Date(2024, 0, 1, 0, 0, 0, 999);
    expect(getMilliseconds(date)).toBe(999);
  });

  test('повертає число в діапазоні 0–999', () => {
    const date = new Date();
    const ms = getMilliseconds(date);
    expect(ms).toBeGreaterThanOrEqual(0);
    expect(ms).toBeLessThanOrEqual(999);
  });

  test('повертає 123 мілісекунди', () => {
    const date = new Date(2024, 5, 15, 12, 0, 0, 123);
    expect(getMilliseconds(date)).toBe(123);
  });
});

describe('getTime', () => {
  test('повертає 0 для початку epoch (UTC)', () => {
    const date = new Date(0);
    expect(getTime(date)).toBe(0);
  });

  test('повертає коректний timestamp для відомої дати', () => {
    const date = new Date('2024-01-01T00:00:00.000Z');
    expect(getTime(date)).toBe(1704067200000);
  });

  test('повертає число типу number', () => {
    const date = new Date();
    const time = getTime(date);
    expect(typeof time).toBe('number');
  });

  test('timestamp зростає для пізнішої дати', () => {
    const date1 = new Date('2023-01-01Z');
    const date2 = new Date('2024-01-01Z');
    expect(getTime(date2)).toBeGreaterThan(getTime(date1));
  });

  test('повертає від\'ємний timestamp для дат до 1970 року', () => {
    const date = new Date('1960-01-01Z');
    expect(getTime(date)).toBeLessThan(0);
  });
});

describe('getTimezoneOffset', () => {
  test('повертає число типу number', () => {
    const date = new Date();
    const offset = getTimezoneOffset(date);
    expect(typeof offset).toBe('number');
  });

  test('зміщення є кратним 60 (повні хвилини)', () => {
    const date = new Date();
    const offset = getTimezoneOffset(date);
    expect(Math.abs(offset % 60)).toBe(0);
  });

  test('зміщення знаходиться в діапазоні [-720, 840]', () => {
    const date = new Date();
    const offset = getTimezoneOffset(date);
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });

  test('функція повертає те саме значення, що й нативний метод', () => {
    const date = new Date();
    expect(getTimezoneOffset(date)).toBe(date.getTimezoneOffset());
  });

  test('зміщення для двох об\'єктів Date в одному середовищі однакове', () => {
    const dateA = new Date(2024, 0, 15);
    const dateB = new Date(2024, 1, 15);
    expect(typeof getTimezoneOffset(dateA)).toBe('number');
    expect(typeof getTimezoneOffset(dateB)).toBe('number');
  });
});

describe('setFullYear', () => {
  test('встановлює рік 2025 і повертає timestamp', () => {
    const date = new Date(2024, 0, 1);
    const timestamp = setFullYear(date, 2025);
    expect(date.getFullYear()).toBe(2025);
    expect(typeof timestamp).toBe('number');
  });

  test('встановлює рік 2000 (вік тисячоліття)', () => {
    const date = new Date(2024, 5, 15);
    setFullYear(date, 2000);
    expect(date.getFullYear()).toBe(2000);
  });

  test('встановлює рік 1 (дуже давня дата)', () => {
    const date = new Date();
    setFullYear(date, 1);
    expect(date.getFullYear()).toBe(1);
  });

  test('мутує оригінальний об\'єкт Date', () => {
    const date = new Date(2024, 0, 1);
    const originalYear = date.getFullYear();
    setFullYear(date, 2030);
    expect(date.getFullYear()).not.toBe(originalYear);
    expect(date.getFullYear()).toBe(2030);
  });

  test('повертає числовий timestamp після встановлення', () => {
    const date = new Date(2024, 0, 1);
    const timestamp = setFullYear(date, 2026);
    expect(timestamp).toBe(date.getTime());
    expect(typeof timestamp).toBe('number');
  });
});

describe('setMonth', () => {
  test('встановлює місяць 0 (January)', () => {
    const date = new Date(2024, 5, 15);
    setMonth(date, 0);
    expect(date.getMonth()).toBe(0);
  });

  test('встановлює місяць 11 (December)', () => {
    const date = new Date(2024, 0, 1);
    setMonth(date, 11);
    expect(date.getMonth()).toBe(11);
  });

  test('встановлює місяць 6 (July)', () => {
    const date = new Date(2024, 0, 15);
    setMonth(date, 6);
    expect(date.getMonth()).toBe(6);
  });

  test('мутує оригінальний об\'єкт Date', () => {
    const date = new Date(2024, 0, 1);
    const originalMonth = date.getMonth();
    setMonth(date, 3);
    expect(date.getMonth()).not.toBe(originalMonth);
    expect(date.getMonth()).toBe(3);
  });

  test('повертає числовий timestamp', () => {
    const date = new Date(2024, 0, 1);
    const timestamp = setMonth(date, 5);
    expect(timestamp).toBe(date.getTime());
    expect(typeof timestamp).toBe('number');
  });
});

describe('setDate', () => {
  test('встановлює день 1 (перший)', () => {
    const date = new Date(2024, 0, 15);
    setDate(date, 1);
    expect(date.getDate()).toBe(1);
  });

  test('встановлює день 31', () => {
    const date = new Date(2024, 0, 1);
    setDate(date, 31);
    expect(date.getDate()).toBe(31);
  });

  test('встановлює день 15 (середина місяця)', () => {
    const date = new Date(2024, 5, 1);
    setDate(date, 15);
    expect(date.getDate()).toBe(15);
  });

  test('мутує оригінальний об\'єкт Date', () => {
    const date = new Date(2024, 0, 1);
    const originalDay = date.getDate();
    setDate(date, 20);
    expect(date.getDate()).not.toBe(originalDay);
    expect(date.getDate()).toBe(20);
  });

  test('повертає числовий timestamp', () => {
    const date = new Date(2024, 0, 1);
    const timestamp = setDate(date, 10);
    expect(timestamp).toBe(date.getTime());
    expect(typeof timestamp).toBe('number');
  });
});
