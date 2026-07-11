import type { ImageMetadata } from "astro";

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/images/products/*.{avif,gif,jpeg,jpg,png,webp}",
  { eager: true }
);

const imageRegistry = new Map<string, ImageMetadata>();

for (const [modulePath, imageModule] of Object.entries(imageModules)) {
  const filename = modulePath.split("/").at(-1);
  if (filename) imageRegistry.set(`images/products/${filename}`, imageModule.default);
}

export function resolveImage(src: string): ImageMetadata {
  const normalizedSrc = src.replace(/^\//, "");
  const image = imageRegistry.get(normalizedSrc);

  if (!image) {
    throw new Error(`Image is not registered in src/assets: ${src}`);
  }

  return image;
}

export function responsiveWidths(image: ImageMetadata, candidates: number[]): number[] {
  const maximumWidth = Math.min(image.width, Math.max(...candidates));
  const widths = candidates.filter((width) => width > 0 && width <= maximumWidth);

  if (!widths.includes(maximumWidth)) widths.push(maximumWidth);

  return [...new Set(widths)].sort((left, right) => left - right);
}
