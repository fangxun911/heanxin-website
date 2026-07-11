import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const base = "/heanxin-website/";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function listHtmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(absolutePath);
    return entry.name.endsWith(".html") ? [absolutePath] : [];
  });
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

function srcsetEntries(value) {
  return value.split(",").map((entry) => {
    const [url, descriptor] = entry.trim().split(/\s+/);
    return { url, width: Number.parseInt(descriptor, 10) };
  });
}

function outputPath(url) {
  assert(url.startsWith(base), `Image URL must include the GitHub Pages base: ${url}`);
  return path.join(dist, url.slice(base.length).split(/[?#]/)[0]);
}

function assertOutputExists(url, label) {
  const absolutePath = outputPath(url);
  assert(existsSync(absolutePath), `${label} does not exist: ${url}`);
  return absolutePath;
}

assert(existsSync(dist), "dist/ is missing; run the production build first");

const htmlFiles = listHtmlFiles(dist);
let pictureCount = 0;
let imageCount = 0;

for (const file of htmlFiles) {
  const relativeFile = path.relative(dist, file);
  const html = readFileSync(file, "utf8");
  const pictures = html.match(/<picture\b[\s\S]*?<\/picture>/g) ?? [];
  const images = html.match(/<img\b[^>]*>/g) ?? [];
  const highPriorityImages = images.filter((image) => attribute(image, "fetchpriority") === "high");

  assert(
    highPriorityImages.length <= 1,
    `${relativeFile} contains more than one high-priority image`
  );

  for (const image of images) {
    const src = attribute(image, "src");
    if (!src || !/\.(?:avif|jpe?g|png|webp)(?:[?#]|$)/i.test(src)) continue;

    const srcset = attribute(image, "srcset");
    assert(srcset, `${relativeFile} contains a raster image without srcset: ${src}`);
    assert(attribute(image, "sizes"), `${relativeFile} contains an image without sizes: ${src}`);
    assert(attribute(image, "width"), `${relativeFile} contains an image without width: ${src}`);
    assert(attribute(image, "height"), `${relativeFile} contains an image without height: ${src}`);
    assert(
      attribute(image, "loading"),
      `${relativeFile} contains an image without loading: ${src}`
    );

    assertOutputExists(src, `${relativeFile} image`);
    for (const entry of srcsetEntries(srcset)) {
      assert(Number.isFinite(entry.width), `${relativeFile} has an invalid srcset descriptor`);
      assertOutputExists(entry.url, `${relativeFile} srcset candidate`);
    }

    imageCount += 1;
  }

  for (const picture of pictures) {
    const avifSource = picture.match(/<source\b[^>]*type="image\/avif"[^>]*>/)?.[0];
    assert(avifSource, `${relativeFile} contains a picture without an AVIF source`);
    const avifSrcset = attribute(avifSource, "srcset");
    assert(avifSrcset, `${relativeFile} contains an AVIF source without srcset`);

    for (const entry of srcsetEntries(avifSrcset)) {
      assertOutputExists(entry.url, `${relativeFile} AVIF candidate`);
    }

    pictureCount += 1;
  }

  assert(
    !html.includes(`${base}images/products/`),
    `${relativeFile} still references an unoptimized public product image`
  );
}

const homeHtml = readFileSync(path.join(dist, "index.html"), "utf8");
const homeHeroPicture = (homeHtml.match(/<picture\b[\s\S]*?<\/picture>/g) ?? []).find((picture) =>
  picture.includes('fetchpriority="high"')
);
assert(homeHeroPicture, "Home page must contain one high-priority hero picture");

const homeHeroSource = homeHeroPicture.match(/<source\b[^>]*type="image\/avif"[^>]*>/)?.[0];
const homeHeroImage = homeHeroPicture.match(/<img\b[^>]*>/)?.[0];
assert(homeHeroSource && homeHeroImage, "Home hero picture is incomplete");

for (const [label, srcset] of [
  ["AVIF", attribute(homeHeroSource, "srcset")],
  ["WebP", attribute(homeHeroImage, "srcset")],
]) {
  const candidate = srcsetEntries(srcset).find((entry) => entry.width === 1280);
  assert(candidate, `Home hero ${label} srcset must contain a 1280w candidate`);
  const size = statSync(assertOutputExists(candidate.url, `Home hero ${label} candidate`)).size;
  assert(size <= 100 * 1024, `Home hero ${label} 1280w candidate exceeds 100 KiB`);
}

const productsHtml = readFileSync(path.join(dist, "products/index.html"), "utf8");
const productImages = productsHtml.match(/<img\b[^>]*>/g) ?? [];
assert(productImages.length > 0, "Products page must contain product images");
assert(
  productImages.every((image) => attribute(image, "loading") === "lazy"),
  "Products page contains a non-lazy product image"
);

console.log(
  `Image performance checks passed (${htmlFiles.length} pages, ${pictureCount} pictures, ${imageCount} raster images)`
);
