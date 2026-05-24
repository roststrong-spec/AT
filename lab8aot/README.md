# Puppeteer & Gauge Comparison

## Опис проекту
Цей приклад демонструє:
- UI тести на `Puppeteer` + `Jest`
- UI сценарії на `Gauge` із виконанням на `Puppeteer`

## Структура

- `puppeteer-tests/puppeteer.ui.test.js` — 9 UI тестів для сайту `https://books.toscrape.com`
- `gauge-tests/tests/books_catalogue.spec` — специфікації Gauge у Markdown
- `gauge-tests/tests/step_implementations.js` — реалізація кроків Gauge на JavaScript
- `gauge-tests/manifest.json` — конфігурація Gauge проекту
- `gauge-tests/env/default/default.properties` — пустий профіль Gauge

## Як запустити

1. Встановіть залежності:

```bash
npm install
```

2. Запустіть Puppeteer тести:

```bash
npm test
```

3. Запустіть Gauge тести (потрібен встановлений Gauge CLI):

```bash
npm run gauge
```

## Порівняльна таблиця

| Інструмент | Сильна сторона | Слабка сторона | Типові задачі |
|---|---|---|---|
| Puppeteer | Прямий контроль над Chrome, швидкий, скріншоти/PDF, headless, офіційна підтримка Google | Тільки Chrome/Chromium, потребує написання власних утиліт очікування | Веб-скрепінг, headless UI тести, генерація PDF/скріншотів, performance |
| Gauge | Специфікації у Markdown, BDD підхід, підтримка кількох мов (JS, Java, Python) | Невелика спільнота, менша документація, обмежена екосистема плагінів | BDD/ATDD тестування, специфікації на природній мові, acceptance tests |

## Детальний аналіз

### Puppeteer
- Тип: бібліотека (не фреймворк)
- Підтримка браузерів: Chrome та Chromium (з v21+ також Firefox в experimental режимі)
- Інтеграція: Jest, Mocha, Jasmine
- Версія: активно підтримується Google
- Рівень API: низькорівневий доступ до CDP
- Перевага: більш зрілий та широко вживаний у промислових проектах
- Недолік: тести не є специфікацією, менша читабельність для бізнесу

### Gauge
- Тип: фреймворк (BDD/ATDD)
- Мови: JavaScript, Java, Python, Ruby, C#
- Формат: `.spec` файли у Markdown + кроки в окремих файлах
- Звіти: вбудована генерація HTML звітів
- Інтеграція з Puppeteer: можливість використовувати Puppeteer як driver
- Перевага: живі специфікації читабельні для нетехнічних учасників
- Недолік: менша спільнота та менше навчальних матеріалів
