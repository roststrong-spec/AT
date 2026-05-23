const TARGET_URL = 'https://books.toscrape.com';
const SELECT_OPTIONS = [
  { textContent: 'Default', value: 'default' },
  { textContent: 'Price (low to high)', value: 'price-asc' },
  { textContent: 'Price (high to low)', value: 'price-desc' },
];

const createElement = (selector) => {
  const element = { textContent: '', className: '' };

  switch (selector) {
    case 'h1':
      element.textContent = 'All products';
      break;
    case '.breadcrumb':
      element.textContent = 'Home';
      break;
    case '.breadcrumb li:first-child a':
      element.textContent = 'Home';
      break;
    case '.form-horizontal strong':
      element.textContent = '1000';
      break;
    case 'li.current':
      element.textContent = 'Page 1 of 50';
      break;
    case 'article.product_pod p.star-rating':
    case 'p.star-rating':
      element.className = 'star-rating Three';
      break;
    case 'article.product_pod p.price_color':
    case 'p.price_color':
      element.textContent = '£51.77';
      break;
    case '.availability':
      element.textContent = 'In stock (20 available)';
      break;
    case 'article.product_pod h3 a':
      element.textContent = 'Book title';
      break;
    case '.product_main':
      element.textContent = 'Product details';
      break;
    default:
      element.textContent = 'mocked';
  }

  return element;
};

const createElements = (selector) => {
  const clickable = () => ({ click: async () => {}, textContent: 'Category' });

  switch (selector) {
    case 'article.product_pod':
      return Array.from({ length: 20 }, () => createElement('article.product_pod'));
    case '.side_categories ul li a':
    case '.side_categories ul li ul li a':
      return Array.from({ length: 3 }, () => clickable());
    case 'article.product_pod h3 a':
      return [createElement('article.product_pod h3 a')];
    case '.product_pod .price_color':
      return Array.from({ length: 20 }, () => createElement('article.product_pod p.price_color'));
    case 'select.form-control option':
      return SELECT_OPTIONS.map((option) => ({ textContent: option.textContent, value: option.value }));
    case '.breadcrumb li:first-child a':
      return [{ click: async () => {}, textContent: 'Home' }];
    case '.next a':
      return [{ click: async () => {}, textContent: 'Next' }];
    default:
      return [];
  }
};

const page = {
  currentUrl: TARGET_URL,
  setDefaultTimeout: () => {},
  goto: async (url) => {
    page.currentUrl = url;
  },
  title: async () => 'Books to Scrape',
  url: async () => page.currentUrl,
  waitForSelector: async () => {},
  waitForNavigation: async () => {},
  $eval: async (selector, pageFunction) => {
    const element = createElement(selector);
    return pageFunction(element);
  },
  $$eval: async (selector, pageFunction) => {
    const elements = createElements(selector);
    return pageFunction(elements);
  },
  $: async (selector) => {
    const supportedSelectors = [
      'ol.row',
      'article.product_pod',
      'article.product_pod p.star-rating',
      'article.product_pod p.price_color',
      'p.star-rating',
      'p.price_color',
      '.product_main',
      'article.product_pod .btn',
      'ul.pager',
      '.next a',
      '.side_categories',
      '.side_categories ul li a',
      '.breadcrumb',
      '.breadcrumb li:first-child a',
      'article.product_pod h3 a',
      '.availability',
      'select.form-control',
      '.side_categories ul li ul li a',
    ];
    if (!supportedSelectors.includes(selector)) {
      return null;
    }
    return {
      click: async () => {},
      textContent: selector === '.breadcrumb li:first-child a' ? 'Home' : '',
      className: selector === 'article.product_pod p.star-rating' ? 'star-rating Three' : '',
    };
  },
  $$: async (selector) => createElements(selector),
  select: async (selector, value) => {
    if (selector === 'select.form-control' && SELECT_OPTIONS.some((opt) => opt.value === value)) {
      return [value];
    }

    return [];
  },
  goBack: async () => {},
  close: async () => {},
};

export default {
  launch: async () => ({
    newPage: async () => page,
    close: async () => {},
  }),
};
