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
    case '.form-horizontal strong':
      element.textContent = '1000';
      break;
    case 'li.current':
      element.textContent = 'Page 1 of 50';
      break;
    case 'article.product_pod p.star-rating':
      element.className = 'star-rating Three';
      break;
    case 'article.product_pod p.price_color':
      element.textContent = '£51.77';
      break;
    default:
      element.textContent = 'mocked';
  }

  return element;
};

const createElements = (selector) => {
  switch (selector) {
    case 'article.product_pod':
      return Array.from({ length: 20 }, () => createElement('article.product_pod'));
    case 'select.form-control option':
      return SELECT_OPTIONS.map((option) => ({ textContent: option.textContent, value: option.value }));
    case '.side_categories ul li a':
      return [{}, {}, {}];
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
  $eval: async (selector, pageFunction) => {
    const element = createElement(selector);
    return pageFunction(element);
  },
  $$eval: async (selector, pageFunction) => {
    const elements = createElements(selector);
    return pageFunction(elements);
  },
  $: async (selector) => {
    const exists = [
      'ol.row',
      'article.product_pod',
      'article.product_pod p.star-rating',
      'article.product_pod p.price_color',
      'article.product_pod .btn',
      'ul.pager',
      '.next a',
      '.side_categories',
      'select.form-control',
    ].includes(selector);
    return exists ? {} : null;
  },
  $$: async (selector) => createElements(selector),
  select: async (selector, value) => {
    if (selector === 'select.form-control' && SELECT_OPTIONS.some((opt) => opt.value === value)) {
      return [value];
    }

    return [];
  },
  close: async () => {},
};

export default {
  launch: async () => ({
    newPage: async () => page,
    close: async () => {},
  }),
};
