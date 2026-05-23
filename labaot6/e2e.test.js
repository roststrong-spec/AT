import puppeteer from 'puppeteer';

const BASE_URL = 'https://books.toscrape.com';
let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
});

afterAll(async () => {
  await browser.close();
});

beforeEach(async () => {
  page = await browser.newPage();
  page.setDefaultTimeout(15000);
});

afterEach(async () => {
  await page.close();
});

describe('Сценарій 1: Перегляд каталогу та деталі товару', () => {
  test('1.1 Головна сторінка завантажується та відображає товари', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    expect(title).toMatch(/Books to Scrape/i);

    const cards = await page.$$('article.product_pod');
    expect(cards.length).toBeGreaterThan(0);
  });

  test('1.2 На сторінці відображається рівно 20 карток товарів', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const count = await page.$$eval('article.product_pod', (items) => items.length);
    expect(count).toBe(20);
  });

  test('1.3 Перехід на детальну сторінку першої книги виконується', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const firstLink = await page.$('article.product_pod h3 a');
    expect(firstLink).not.toBeNull();

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      firstLink.click(),
    ]);

    const detailSection = await page.$('.product_main');
    expect(detailSection).not.toBeNull();
  });

  test('1.4 Детальна сторінка містить ціну, рейтинг та стан наявності', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const firstLink = await page.$('article.product_pod h3 a');
    expect(firstLink).not.toBeNull();

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      firstLink.click(),
    ]);

    const price = await page.$eval('p.price_color', (el) => el.textContent.trim());
    const rating = await page.$eval('p.star-rating', (el) => el.className);
    const inStock = await page.$eval('.availability', (el) => el.textContent.trim());

    expect(price).toMatch(/\d+[.,]\d+/);
    expect(rating).toMatch(/One|Two|Three|Four|Five/);
    expect(inStock).toMatch(/stock/i);
  });

  test('1.5 Повернення до головної сторінки через кнопку Back працює', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const firstLink = await page.$('article.product_pod h3 a');
    expect(firstLink).not.toBeNull();

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      firstLink.click(),
    ]);

    await page.goBack({ waitUntil: 'domcontentloaded' });
    const cards = await page.$$('article.product_pod');
    expect(cards.length).toBeGreaterThan(0);
  });
});

describe('Сценарій 2: Навігація за жанром та пагінація', () => {
  test('2.1 Бокова панель жанрів наявна та містить посилання', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.side_categories');

    const genreLinks = await page.$$eval('.side_categories ul li ul li a', (links) =>
      links.map((link) => link.textContent.trim())
    );

    expect(genreLinks.length).toBeGreaterThan(0);
    expect(genreLinks.some((text) => text.length > 0)).toBe(true);
  });

  test('2.2 Перехід до категорії жанру виконується успішно', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.side_categories ul li ul li a');

    const genreLink = (await page.$$('.side_categories ul li ul li a'))[0];
    expect(genreLink).not.toBeNull();

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      genreLink.click(),
    ]);

    const grid = await page.$('ol.row');
    expect(grid).not.toBeNull();
  });

  test('2.3 Сторінка жанру відображає книги та інформацію про ціни', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.side_categories ul li ul li a');

    const genreLink = (await page.$$('.side_categories ul li ul li a'))[0];
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      genreLink.click(),
    ]);

    const cards = await page.$$('article.product_pod');
    expect(cards.length).toBeGreaterThan(0);

    const priceValues = await page.$$eval('.product_pod .price_color', (elements) =>
      elements.map((el) => el.textContent.trim())
    );

    expect(priceValues.length).toBeGreaterThan(0);
    expect(priceValues.every((price) => /\d+[.,]\d+/.test(price))).toBe(true);
  });

  test('2.4 Сторінка категорії містить цінову інформацію для товарів', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.side_categories ul li ul li a');

    const genreLink = (await page.$$('.side_categories ul li ul li a'))[0];
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      genreLink.click(),
    ]);

    const prices = await page.$$eval('.product_pod .price_color', (elements) =>
      elements.map((el) => el.textContent.trim())
    );
    expect(prices.length).toBeGreaterThan(0);
  });

  test('2.5 Кнопка next наявна, перехід на сторінку виконується', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

    const nextBtn = await page.$('.next a');
    expect(nextBtn).not.toBeNull();

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      nextBtn.click(),
    ]);

    const cards = await page.$$('article.product_pod');
    expect(cards.length).toBeGreaterThan(0);
  });
});

describe('Сценарій 3: Перегляд кількох жанрів та breadcrumb-навігація', () => {
  test('3.1 Головна сторінка доступна та має правильний заголовок', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const heading = await page.$eval('h1', (el) => el.textContent.trim());
    expect(heading).toMatch(/All products|Books to Scrape/i);
  });

  test('3.2 Перехід до жанру відображає breadcrumb навігацію', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.side_categories ul li ul li a');

    const genreLink = (await page.$$('.side_categories ul li ul li a'))[0];
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      genreLink.click(),
    ]);

    const breadcrumb = await page.$eval('.breadcrumb', (el) => el.textContent.trim());
    expect(breadcrumb).toMatch(/Home/i);
  });

  test('3.3 Після повернення на головну сторінку каталог відображається', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const cards = await page.$$('article.product_pod');
    expect(cards.length).toBeGreaterThan(0);
  });

  test('3.4 Перехід до другого жанру зі списку виконується коректно', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.side_categories ul li ul li a');

    const genreLinks = await page.$$('.side_categories ul li ul li a');
    expect(genreLinks.length).toBeGreaterThan(1);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      genreLinks[1].click(),
    ]);

    const grid = await page.$('ol.row');
    expect(grid).not.toBeNull();
  });

  test('3.5 Повернення на головну через breadcrumb Home працює', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.side_categories ul li ul li a');

    const genreLink = (await page.$$('.side_categories ul li ul li a'))[0];
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      genreLink.click(),
    ]);

    const homeLink = await page.$('.breadcrumb li:first-child a');
    expect(homeLink).not.toBeNull();

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      homeLink.click(),
    ]);

    const title = await page.title();
    expect(title).toMatch(/Books to Scrape/i);
  });
});
