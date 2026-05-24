const puppeteer = require('puppeteer');

const BASE_URL = 'https://books.toscrape.com';
let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });
});

afterAll(async () => {
  await browser.close();
});

beforeEach(async () => {
  page = await browser.newPage();
  page.setDefaultTimeout(10000);
  await page.goto(BASE_URL);
});

afterEach(async () => {
  await page.close();
});

describe('Puppeteer UI Test 1 — Заголовок сторінки', () => {
  test('заголовок вкладки містить "Books to Scrape"', async () => {
    const title = await page.title();
    expect(title).toMatch(/Books to Scrape/i);
  });

  test('тег h1 відображається на сторінці', async () => {
    const h1 = await page.$('h1');
    expect(h1).not.toBeNull();
  });

  test('URL відповідає цільовому сайту', () => {
    expect(page.url()).toContain('books.toscrape.com');
  });
});

describe('Puppeteer UI Test 2 — Каталог книг', () => {
  test('сторінка містить 20 карток книг', async () => {
    const count = await page.$$eval('article.product_pod', items => items.length);
    expect(count).toBe(20);
  });

  test('кожна картка містить ціну', async () => {
    const prices = await page.$$('article.product_pod p.price_color');
    expect(prices.length).toBeGreaterThan(0);
  });

  test('кнопка додавання до кошика присутня на сторінці', async () => {
    const addButton = await page.$('article.product_pod form button[type="submit"]');
    expect(addButton).not.toBeNull();
  });
});

describe('Puppeteer UI Test 3 — Навігація', () => {
  test('бокова панель жанрів присутня', async () => {
    const sidebar = await page.$('.side_categories');
    expect(sidebar).not.toBeNull();
  });

  test('кнопка наступної сторінки наявна', async () => {
    const next = await page.$('.next a');
    expect(next).not.toBeNull();
  });

  test('пагінація відображає номер поточної сторінки', async () => {
    const current = await page.$eval('li.current', el => el.textContent.trim());
    expect(current).toMatch(/Page 1 of/i);
  });
});
