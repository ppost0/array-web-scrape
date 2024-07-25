const puppeteer = require('puppeteer');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

// puppeteer.use(StealthPlugin());

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function humanDelay(page, min, max) {
  return new Promise(resolve => setTimeout(resolve, getRandomInt(min, max)));
}

(async () => {
  for (let i = 1; i <= 3; i++) {

    const browser = await puppeteer.launch({ headless: true});
    const page = await browser.newPage();

    // Random agent and screen size
    // const userAgents = [
    //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    //   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/89.0'
    // ];
    // const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    // await page.setUserAgent(randomUserAgent);
    // await page.setViewport({ width: getRandomInt(800, 1280), height: getRandomInt(600, 1024) });

    // Disable WebGL and Canvas fingerprinting
    // await page.evaluateOnNewDocument(() => {
    //   Object.defineProperty(navigator, 'language', {
    //       get: function() { return 'en-US'; }
    //   });
    //   Object.defineProperty(navigator, 'platform', {
    //       get: function() { return 'Win32'; }
    //   });
    //   Object.defineProperty(navigator, 'webdriver', {
    //       get: () => false,
    //   });
    // });


    await page.goto('https://abrahamjuliot.github.io/creepjs/', { waitUntil: 'networkidle2' });

    // Wait for necessary elements to load
    await page.waitForNetworkIdle();
    await page.waitForSelector('img', { visible: true });

    // Introduce human-like delays
    await humanDelay(page, 2000, 5000);

    // Simulate mouse movements
    await page.mouse.move(100, 100);
    await humanDelay(page, 500, 1500);
    await page.mouse.click(100, 100);
    await humanDelay(page, 1000, 3000);

    // Extract required information
    const trustScore = await page.$eval('div ::-p-text(trust)', (el) => (el.innerText));
    const lies = await page.$eval('div ::-p-text(lies)', (el) => (el.innerText));
    const bot = await page.$eval('div ::-p-text(bot)', (el) => (el.innerText));
    const fingerprint = await page.$eval('div ::-p-text(FP ID)', (el) => (el.innerText));

    const data = {
      trustScore: trustScore,
      lies: lies,
      bot: bot,
      fingerprint: fingerprint
    }
    console.log(data);

    // Save JSON
    fs.writeFileSync(`data${i}.json`, JSON.stringify(data, null, 2));

    // Scroll to bottom for lazy-loaded images
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Save PDF
    await page.pdf({
      path: `page${i}.pdf`,
      format: 'A4',
      printBackground: true
    });

    await browser.close();
  }
})();
