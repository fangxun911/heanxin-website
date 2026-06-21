async function checkLanguagePersistence(page) {
  await page.goto("http://127.0.0.1:4321/heanxin-website/");
  await page.evaluate(() => localStorage.setItem("lang", "zh"));
  await page.reload();

  await page.locator("[data-lang-toggle]").first().click();
  const switchedLang = await page.evaluate(() =>
    document.documentElement.getAttribute("data-lang")
  );
  if (switchedLang !== "en") {
    throw new Error(`Expected toggle to switch language to en, got ${switchedLang}`);
  }

  await page.locator('nav[aria-label="Primary"] a[href="/heanxin-website/about"]').click();
  await page.waitForURL("**/heanxin-website/about");

  const lang = await page.evaluate(() => document.documentElement.getAttribute("data-lang"));

  if (lang !== "en") {
    throw new Error(`Expected language to stay en after navigation, got ${lang}`);
  }
}
