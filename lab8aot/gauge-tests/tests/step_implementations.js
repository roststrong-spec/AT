const { step, BeforeSpec, AfterSpec } = require('gauge-js');
const puppeteer = require('puppeteer');

let browser;
let page;
const BASE_URL = 'https://books.toscrape.com';

BeforeSpec(async () => {
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  page = await browser.newPage();
  page.setDefaultTimeout(10000);
});

AfterSpec(async () => {
  if (browser) {
    await browser.close();
  }
});

step('Відкрити головну сторінку Books to Scrape', async () => {
  await page.goto(BASE_URL);
});

step('Заголовок вкладки повинен містити "Books to Scrape"', async () => {
  const title = await page.title();
  if (!title.match(/Books to Scrape/i)) {
    throw new Error(`Got: "${title}"`);
  }
});

step('URL сторінки повинен містити "books.toscrape.com"', async () => {
  const url = page.url();
  if (!url.includes('books.toscrape.com')) {
    throw new Error(`Got: "${url}"`);
  }
});

step('Кількість карток книг на сторінці повинна дорівнювати 20', async () => {
  const count = await page.$$eval('article.product_pod', items => items.length);
  if (count !== 20) {
    throw new Error(`Got: ${count}`);
  }
});

step('Кнопка додавання до кошика повинна бути присутня на сторінці', async () => {
  const addButton = await page.$('article.product_pod form button[type="submit"]');
  if (!addButton) {
    throw new Error('Add to basket button not found');
  }
});

step('Бокова панель жанрів повинна бути присутня', async () => {
  const sidebar = await page.$('.side_categories');
  if (!sidebar) {
    throw new Error('Sidebar not found');
  }
});

step('Кнопка переходу на наступну сторінку повинна бути наявна', async () => {
  const next = await page.$('.next a');
  if (!next) {
    throw new Error('Next page link not found');
  }
});

step('Поточна сторінка пагінації повинна відображати номер', async () => {
  const current = await page.$eval('li.current', el => el.textContent.trim());
  if (!current.match(/Page 1 of/i)) {
    throw new Error(`Got: "${current}"`);
  }
});
