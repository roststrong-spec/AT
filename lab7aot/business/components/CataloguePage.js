import { SELECTORS, BASE_URL } from '../../core/config.js';

export class CataloguePage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.goto(BASE_URL);
  }

  async getTitle() {
    return this.page.title();
  }

  async getUrl() {
    return this.page.url();
  }

  async getProductCount() {
    return this.page.$$eval(SELECTORS.productCard, items => items.length);
  }

  async isProductGridVisible() {
    return Boolean(await this.page.$(SELECTORS.productGrid));
  }

  async getGenreLinks() {
    return this.page.$$(SELECTORS.genreLinks);
  }

  async clickGenre(index) {
    const links = await this.getGenreLinks();
    await links[index].click();
    await this.page.waitForSelector(SELECTORS.productGrid);
  }

  async isSortVisible() {
    return Boolean(await this.page.$(SELECTORS.sortSelect));
  }

  async isNextButtonVisible() {
    return Boolean(await this.page.$(SELECTORS.nextButton));
  }

  async sortByPrice() {
    const sort = await this.page.$(SELECTORS.sortSelect);
    if (sort) await sort.click();
    await this.page.waitForSelector(SELECTORS.productGrid);
  }

  async clickNext() {
    const next = await this.page.$(SELECTORS.nextButton);
    if (next) await next.click();
    await this.page.waitForSelector(SELECTORS.productGrid);
  }

  async getBreadcrumbText() {
    return this.page.$eval(SELECTORS.breadcrumb, el => el.textContent);
  }

  async getFirstProductCardText() {
    return this.page.$eval(SELECTORS.productCard, el => el.textContent);
  }
}
