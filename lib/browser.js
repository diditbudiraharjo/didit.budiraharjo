const { chromium } = require("playwright");

const CHROMIUM_EXECUTABLE_PATH = "/opt/pw-browsers/chromium";

function launchBrowser(options = {}) {
  return chromium.launch({
    executablePath: CHROMIUM_EXECUTABLE_PATH,
    ...options,
  });
}

module.exports = { launchBrowser, CHROMIUM_EXECUTABLE_PATH };
