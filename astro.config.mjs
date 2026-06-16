// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// GitHub Pages project page deployment.
// Live URL: https://xunfang-ponyai.github.io/heanxin-website/
// `base` MUST match the repository name, otherwise CSS/images/links 404.
// Tailwind v4 is wired through PostCSS (postcss.config.mjs) for compatibility
// with Astro's rolldown-based Vite, instead of the @tailwindcss/vite plugin.
export default defineConfig({
  site: "https://xunfang-ponyai.github.io",
  base: "/heanxin-website",
  trailingSlash: "ignore",
  integrations: [sitemap()],
});
