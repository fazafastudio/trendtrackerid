// =============================================
// TrendTracker ID - PWA Icon Generator
// Generates public/icon-192.png and public/icon-512.png
// from a single inline SVG (emerald-500 background + "TT" text).
//
// Why SVG → sharp:
//   - sharp has no built-in text/font API
//   - SVG keeps the "TT" glyph vector-perfect at any size
//   - No font files, no native build dependencies
//
// Run with:
//   npm run icons
// =============================================

import sharp from "sharp";
import { join } from "node:path";
import { cwd } from "node:process";

const BRAND_COLOR = "#10b981"; // Tailwind emerald-500
const BRAND_TEXT = "TT";

/** Sizes required by app/manifest.ts. */
const ICON_SIZES = [192, 512] as const;

/**
 * Build the inline SVG used as the source for rasterization.
 * `size` is used both as the canvas dimension and to scale the text
 * proportionally so the glyph looks the same at 192 and 512.
 */
function buildSvg(size: number): Buffer {
  const fontSize = Math.round(size * 0.575);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BRAND_COLOR}"/>
  <text
    x="50%"
    y="50%"
    font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    font-size="${fontSize}"
    font-weight="800"
    fill="#ffffff"
    text-anchor="middle"
    dominant-baseline="central"
    letter-spacing="-2"
  >${BRAND_TEXT}</text>
</svg>`;
  return Buffer.from(svg, "utf8");
}

/** Rasterize the SVG to a PNG and write it to public/. */
async function generateIcon(size: (typeof ICON_SIZES)[number]): Promise<string> {
  const svgBuffer = buildSvg(size);
  const outPath = join(cwd(), "public", `icon-${size}.png`);

  await sharp(svgBuffer)
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  return outPath;
}

async function main(): Promise<void> {
  console.log("🎨 Generating PWA icons…");
  for (const size of ICON_SIZES) {
    const out = await generateIcon(size);
    console.log(`  ✓ ${out}`);
  }
  console.log("✅ Done.");
}

main().catch((err: unknown) => {
  console.error("❌ Icon generation failed");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});