import { CataloguePage } from '../../business/components/CataloguePage.js';
import { launchBrowser } from '../../core/browser.js';

let browser;
beforeAll(async () => { browser = await launchBrowser(); });
afterAll(async () => { await browser.close(); });

let page;
beforeEach(async () => {
  page = await browser.newPage();
});

test('заголовок містить Books to Scrape', async () => {
  const catalogue = new CataloguePage(page);
  await catalogue.open();
  expect(await catalogue.getTitle()).toContain('Books to Scrape');
});

test('URL відповідає очікуваному', async () => {
  const catalogue = new CataloguePage(page);
  await catalogue.open();
  expect(await catalogue.getUrl()).toBe('https://books.toscrape.com');
});

test('сітка товарів наявна', async () => {
  const catalogue = new CataloguePage(page);
  await catalogue.open();
  expect(await catalogue.isProductGridVisible()).toBe(true);
});

test('рівно 20 карток товарів', async () => {
  const catalogue = new CataloguePage(page);
  await catalogue.open();
  expect(await catalogue.getProductCount()).toBe(20);
});

test('бокова панель жанрів наявна', async () => {
  const catalogue = new CataloguePage(page);
  await catalogue.open();
  expect((await catalogue.getGenreLinks()).length).toBeGreaterThan(0);
});

test('кнопка next наявна', async () => {
  const catalogue = new CataloguePage(page);
  await catalogue.open();
  expect(await catalogue.isNextButtonVisible()).toBe(true);
});

test('елемент сортування наявний', async () => {
  const catalogue = new CataloguePage(page);
  await catalogue.open();
  expect(await catalogue.isSortVisible()).toBe(true);
});

test('сортування виконується без помилок', async () => {
  const catalogue = new CataloguePage(page);
  await catalogue.open();
  await expect(catalogue.sortByPrice()).resolves.not.toThrow();
});

test('посилання жанрів наявні', async () => {
  const catalogue = new CataloguePage(page);
  await catalogue.open();
  expect((await catalogue.getGenreLinks()).length).toBeGreaterThan(0);
});

test('перша картка товару існує', async () => {
  const catalogue = new CataloguePage(page);
  await catalogue.open();
  expect(await catalogue.getFirstProductCardText()).toBe('First product card');
});
