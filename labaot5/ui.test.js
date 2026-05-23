import { jest } from '@jest/globals';

const TARGET_URL = 'https://books.toscrape.com';
const usePuppeteerMock = process.env.CI === 'true' || process.env.CI === '1' || process.env.PUPPETEER_MOCK === 'true';

let puppeteer;
let browser;
let page;

beforeAll(async () => {
  if (usePuppeteerMock) {
    await jest.unstable_mockModule('puppeteer', async () => import('./__mocks__/puppeteer.js'));
  }

  const imported = await import('puppeteer');
  puppeteer = imported.default;

  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
});

afterAll(async () => {
  if (browser && browser.close) {
    await browser.close();
  }
});

beforeEach(async () => {
  page = await browser.newPage();
  page.setDefaultTimeout(10000);
  await page.goto(TARGET_URL);
});

afterEach(async () => {
  if (page && page.close) {
    await page.close();
  }
});

describe('Перевірка заголовку сторінки', () => {
  test('заголовок вкладки містить "Books to Scrape"', async () => {
    expect(await page.title()).toMatch(/Books to Scrape/i);
  });

  test('URL сторінки відповідає очікуваному', async () => {
    expect(await page.url()).toContain('books.toscrape.com');
  });

  test('тег <h1> містить "All products"', async () => {
    const heading = await page.$eval('h1', (el) => el.textContent);
    expect(heading).toMatch(/All products/i);
  });

  test('breadcrumb відображається на сторінці', async () => {
    const breadcrumb = await page.$eval('.breadcrumb', (el) => el.textContent);
    expect(breadcrumb).toMatch(/Home/i);
  });

  test('кількість результатів відображається у формі', async () => {
    const total = await page.$eval('.form-horizontal strong', (el) => el.textContent);
    expect(total).toMatch(/1000/);
  });
});

describe('Наявність товарів на сторінці', () => {
  test('сітка товарів (ol.row) наявна', async () => {
    expect(await page.$('ol.row')).not.toBeNull();
  });

  test('кількість карток більша за нуль', async () => {
    const cards = await page.$$eval('article.product_pod', (items) => items.length);
    expect(cards).toBeGreaterThan(0);
  });

  test('на сторінці рівно 20 карток товарів', async () => {
    const cards = await page.$$eval('article.product_pod', (items) => items.length);
    expect(cards).toBe(20);
  });

  test('картки товарів наявні та доступні', async () => {
    const cards = await page.$$('article.product_pod');
    expect(cards.length).toBeGreaterThan(0);
  });

  test('перший елемент сітки існує', async () => {
    const firstCard = await page.$('article.product_pod');
    expect(firstCard).not.toBeNull();
    expect(firstCard).toBeDefined();
  });
});

describe('Рейтинги та ціни товарів', () => {
  test('зірковий рейтинг наявний у картці', async () => {
    expect(await page.$('article.product_pod p.star-rating')).not.toBeNull();
  });

  test('клас рейтингу містить допустиме значення', async () => {
    const className = await page.$eval('article.product_pod p.star-rating', (el) => el.className);
    expect(className).toMatch(/One|Two|Three|Four|Five/);
  });

  test('ціна наявна у картці першого товару', async () => {
    expect(await page.$('article.product_pod p.price_color')).not.toBeNull();
  });

  test('текст ціни містить числове значення', async () => {
    const priceText = await page.$eval('article.product_pod p.price_color', (el) => el.textContent);
    expect(priceText).toMatch(/\d+\.\d+/);
  });

  test('кнопка додавання в кошик наявна', async () => {
    expect(await page.$('article.product_pod .btn')).not.toBeNull();
  });
});

describe('Навігація та пагінація', () => {
  test('блок пагінації наявний на сторінці', async () => {
    expect(await page.$('ul.pager')).not.toBeNull();
  });

  test('кнопка "next" існує', async () => {
    expect(await page.$('.next a')).not.toBeNull();
  });

  test('текст пагінації містить номер сторінки', async () => {
    const pageText = await page.$eval('li.current', (el) => el.textContent);
    expect(pageText).toMatch(/Page 1 of/i);
  });

  test('бокова панель навігації по жанрах наявна', async () => {
    expect(await page.$('.side_categories')).not.toBeNull();
  });

  test('список категорій містить посилання', async () => {
    const categories = await page.$$('.side_categories ul li a');
    expect(categories.length).toBeGreaterThan(0);
  });
});

describe('Сортування товарів', () => {
  test('елемент вибору сортування наявний', async () => {
    expect(await page.$('select.form-control')).not.toBeNull();
  });

  test('список сортування містить варіанти', async () => {
    const options = await page.$$eval('select.form-control option', (items) => items.length);
    expect(options).toBeGreaterThan(0);
  });

  test('є варіант "Price (low to high)"', async () => {
    const labels = await page.$$eval('select.form-control option', (opts) => opts.map((opt) => opt.textContent.trim()));
    expect(labels).toContain('Price (low to high)');
  });

  test('є варіант "Price (high to low)"', async () => {
    const labels = await page.$$eval('select.form-control option', (opts) => opts.map((opt) => opt.textContent.trim()));
    expect(labels).toContain('Price (high to low)');
  });

  test('вибір опції сортування без помилок', async () => {
    await expect(page.select('select.form-control', 'price-asc')).resolves.toBeDefined();
  });
});
