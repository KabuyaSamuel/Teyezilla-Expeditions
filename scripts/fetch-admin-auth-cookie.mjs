#!/usr/bin/env node
// Logs in as the dedicated CI Lighthouse staff account and prints the
// resulting Supabase auth cookie as a "name=value" pair on stdout.
//
// This exists because @lhci/cli's collect.settings.puppeteerScript +
// disableStorageReset combination proved unreliable for this: LHCI's
// NodeRunner spawns the actual Lighthouse audit as a *separate CLI
// subprocess* that reconnects to the puppeteerScript's browser by port --
// and in practice that reconnect does not reliably preserve the session
// cookie the login script just set, even though the browser instance and
// port are correct (confirmed directly: a second Puppeteer page in the
// same browser sees the cookie fine; the Lighthouse CLI subprocess
// sometimes doesn't). Rather than depend on that, this script logs in
// once, extracts the real cookie value, and lighthouserc.admin.js sends it
// via collect.settings.extraHeaders on every request -- no browser-state
// sharing involved, so nothing to lose in a handoff.
//
// Usage: node scripts/fetch-admin-auth-cookie.mjs
// Requires LHCI_ADMIN_EMAIL, LHCI_ADMIN_PASSWORD, and optionally
// LHCI_BASE_URL (defaults to production) and CHROME_PATH.

import puppeteer from "puppeteer-core";
import { existsSync } from "fs";

const email = process.env.LHCI_ADMIN_EMAIL;
const password = process.env.LHCI_ADMIN_PASSWORD;
if (!email || !password) {
  console.error("LHCI_ADMIN_EMAIL / LHCI_ADMIN_PASSWORD are not set.");
  process.exit(1);
}

const baseUrl = (process.env.LHCI_BASE_URL || "https://www.teyezillaexpeditions.com").replace(/\/$/, "");

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  for (const candidate of ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error("No Chrome/Chromium binary found. Set CHROME_PATH.");
}

const browser = await puppeteer.launch({
  executablePath: findChrome(),
  headless: true,
  args: ["--no-sandbox"],
});

async function diagnosePage(page, label) {
  const title = await page.title().catch(() => "(no title)");
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 500)).catch(() => "(couldn't read body)");
  console.error(`--- ${label} ---`);
  console.error("URL:", page.url());
  console.error("Title:", title);
  console.error("Body snippet:", bodyText);
  console.error("---");
}

try {
  const page = await browser.newPage();
  await page.goto(`${baseUrl}/admin/login`, { waitUntil: "networkidle0" });

  // networkidle0 only guarantees the network went quiet, not that the
  // client-rendered LoginForm has actually mounted -- wait for the real
  // element instead of assuming it's there the instant navigation resolves.
  try {
    await page.waitForSelector("#email", { timeout: 15000 });
  } catch {
    await diagnosePage(page, "Login page never showed #email");
    throw new Error("Timed out waiting for the login form's #email field to appear -- see page diagnostics above.");
  }

  await page.type("#email", email);
  await page.type("#password", password);
  await page.click('button[type="submit"]');

  try {
    await page.waitForFunction(() => !window.location.pathname.startsWith("/admin/login"), { timeout: 20000 });
  } catch {
    await diagnosePage(page, "Login did not redirect away from /admin/login");
    throw new Error("Login form submitted but never redirected within 20s -- see page diagnostics above.");
  }

  const cookies = await page.cookies();
  const authCookie = cookies.find((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));
  if (!authCookie) {
    throw new Error(`No sb-*-auth-token cookie found after login. Cookies present: ${cookies.map((c) => c.name).join(", ")}`);
  }

  process.stdout.write(`${authCookie.name}=${authCookie.value}\n`);
} finally {
  await browser.close();
}
