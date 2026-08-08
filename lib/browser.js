const { chromium } = require("playwright");

const CHROMIUM_EXECUTABLE_PATH = "/opt/pw-browsers/chromium";

// This sandbox routes all outbound HTTPS through a local proxy that
// re-terminates TLS with its own CA, so navigation needs the proxy
// server passed explicitly and HTTPS errors ignored (see page contexts).
const AGENT_PROXY_SERVER = process.env.HTTPS_PROXY || process.env.https_proxy;

function launchBrowser(options = {}) {
  return chromium.launch({
    executablePath: CHROMIUM_EXECUTABLE_PATH,
    proxy: AGENT_PROXY_SERVER
      ? { server: AGENT_PROXY_SERVER, bypass: "localhost,127.0.0.1" }
      : undefined,
    ...options,
  });
}

module.exports = { launchBrowser, CHROMIUM_EXECUTABLE_PATH, AGENT_PROXY_SERVER };
