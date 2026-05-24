const BASE_URL = 'https://books.toscrape.com';

function createPage() {
  const page = {
    currentUrl: '',
    goto: async (url) => {
      page.currentUrl = url;
    },
    title: async () => 'Books to Scrape',
    url: () => page.currentUrl,
    setDefaultTimeout: () => {},
    waitForSelector: async () => {},
    $$eval: async (sel, fn) => {
      let items = [];
      if (sel === 'article.product_pod') {
        items = new Array(20).fill({ textContent: 'A book title' });
      } else if (sel === '.side_categories ul li a') {
        items = new Array(5).fill({ textContent: 'Genre' });
      } else if (sel === '.breadcrumb') {
        items = [{ textContent: 'Home > Mystery' }];
      }
      return fn(items);
    },
    $$: async (sel) => {
      if (sel === '.side_categories ul li a') {
        return new Array(5).fill({
          click: async () => {
            page.currentUrl = `${BASE_URL}/catalogue/category/books/mystery_3/index.html`;
          }
        });
      }
      return [];
    },
    $: async (sel) => {
      if (sel === 'select.form-control' || sel === '.row' || sel === 'button.next') {
        return {
          click: async () => {
            if (sel === 'button.next') {
              page.currentUrl = `${BASE_URL}/catalogue/page-2.html`;
            }
          }
        };
      }
      return null;
    },
    $eval: async (selector, fn) => {
      const element = {
        textContent: selector === '.breadcrumb' ? 'Home > Mystery' : 'First product card'
      };
      return fn(element);
    }
  };

  return page;
}

module.exports = {
  launch: async () => ({
    newPage: async () => createPage(),
    close: async () => {}
  })
};
