import puppeteer from 'puppeteer';
import { TIMEOUT } from './config.js';

export async function launchBrowser() {
  return puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
}

export async function newPage(browser) {
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);
  return page;
}
