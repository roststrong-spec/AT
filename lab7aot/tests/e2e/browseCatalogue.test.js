import { CataloguePage } from '../../business/components/CataloguePage.js';
import { launchBrowser } from '../../core/browser.js';

let browser;
beforeAll(async () => { browser = await launchBrowser(); });
afterAll(async () => { await browser.close(); });

let page;
beforeEach(async () => {
  page = await browser.newPage();
});

test('E2E 1: головна відкривається та показує товари', async () => {
  const catalogue = new CataloguePage(page);
  await catalogue.open();
  expect(await catalogue.getProductCount()).toBeGreaterThan(0);
});

test('E2E 2: перехід до жанру та перевірка товарів', async () => {
  const catalogue = new CataloguePage(page);
  await catalogue.open();
  await catalogue.clickGenre(0);
  expect(await catalogue.getProductCount()).toBe(20);
});

test('E2E 3: сортування за ціною виконується', async () => {
  const catalogue = new CataloguePage(page);
  await catalogue.open();
  await expect(catalogue.sortByPrice()).resolves.not.toThrow();
});

test('E2E 4: кнопка next переходить на наступну сторінку', async () => {
  const catalogue = new CataloguePage(page);
  await catalogue.open();
  await catalogue.clickNext();
  expect(await catalogue.getUrl()).toContain('page-2.html');
});

test('E2E 5: breadcrumb після переходу до жанру містить Home', async () => {
  const catalogue = new CataloguePage(page);
  await catalogue.open();
  await catalogue.clickGenre(0);
  expect(await catalogue.getBreadcrumbText()).toContain('Home');
});
