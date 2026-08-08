const { launchBrowser } = require("../lib/browser");

async function scrape(url) {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage({ ignoreHTTPSErrors: true });
    await page.goto(url, { waitUntil: "domcontentloaded" });

    return {
      url,
      title: await page.title(),
      heading: await page.locator("h1").first().textContent().catch(() => null),
    };
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  const url = process.argv[2] || "https://example.com";
  scrape(url)
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { scrape };
