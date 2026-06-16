import siteData from "../content/site.json";

/** A piece of text available in both site languages. */
export interface LocalizedText {
  en: string;
  zh: string;
}

/** Site-wide data (company, contact, nav, footer). */
export const site = siteData;

/**
 * Build a URL that respects the configured GitHub Pages base path.
 * Always use this for internal links and asset references so the site
 * works under https://<user>.github.io/<repo>/.
 */
export function url(path = ""): string {
  const base = import.meta.env.BASE_URL; // e.g. "/heanxin-website/"
  const clean = path.replace(/^\/+/, "");
  return base.endsWith("/") ? `${base}${clean}` : `${base}/${clean}`;
}
