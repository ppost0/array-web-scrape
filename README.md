# Web Scraping and Data Processing with Puppeteer

## Challenges:

In trying to maximize trust score while scraping from CreepJS some challenges were encountered.

Some factors affecting the trust score likely include the browser, agent, window size and other attributes. Some attempts were made to bypass these detections, but did not succeed. Attempts to mask identifying browser information such as agent, screen size, and WebGL fingerprinting only resulted in trust score plummeting to 0%. Attempts to make use of puppeteer-extra and its stealth plugin also plummeted trust score to 0%. Attempts to emulate human behavior did not seem to improve the score. Attempts to utilize a different browser via puppeteer were unsuccessful (such as puppeteer-firefox).

