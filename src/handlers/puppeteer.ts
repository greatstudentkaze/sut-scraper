import puppeteer, { Browser } from 'puppeteer';

const LAUNCH_PUPPETEER_OPTS = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=1920x1080'
  ]
};

class PuppeteerHandler {
  private browser: Browser | null;

  constructor() {
    this.browser = null;
  }

  async initBrowser() {
    this.browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
  }

  async closeBrowser() {
    if (!this.browser) {
      throw Error('Browser not initialized!');
    }

    await this.browser.close();
  }

  async getPageContent(url: string) {
    if (!this.browser) {
      throw Error('Browser not initialized!');
    }

    try {
      const page = await this.browser.newPage();
      await page.goto(url);

      return await page.content();
    } catch (err) {
      throw err; // пробрасываем, чтобы обработка ошибок была на одном уровне
    }
  }
}

export default PuppeteerHandler;
