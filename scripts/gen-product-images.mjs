// Generates soft tinted placeholder JPGs into public/products/{slug}.jpg.
// Run once:  node scripts/gen-product-images.mjs
// A handful of slugs are deliberately skipped so the demo also exercises the
// <img onError> fallback (image_url set, file missing).

import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = new URL("../public/products/", import.meta.url);

/** slug -> category, for the hue */
const CATEGORY = {
  eggs: "eggs",
  onion: "veg",
  potato: "veg",
  carrot: "veg",
  cabbage: "veg",
  tomato: "veg",
  cucumber: "veg",
  garlic: "veg",
  greens: "veg",
  apple: "fruit",
  lemon: "fruit",
  banana: "fruit",
  orange: "fruit",
  sulguni: "dairy",
  imeruli: "dairy",
  butter: "dairy",
  matsoni: "dairy",
  smetana: "dairy",
  xacho: "dairy",
  milk: "dairy",
  chicken: "meat",
  "chicken-fillet": "meat",
  pork: "meat",
  beef: "meat",
  flour: "bakery",
  sugar: "bakery",
  salt: "bakery",
  rice: "bakery",
  pasta: "bakery",
  yeast: "bakery",
  "oil-sunflower": "oil",
  "oil-olive": "oil",
  "pickle-cucumber": "pickle",
  jonjoli: "pickle",
  "pickled-cabbage": "pickle",
};

const HUE = {
  eggs: 44,
  veg: 132,
  fruit: 20,
  dairy: 208,
  meat: 4,
  bakery: 32,
  oil: 66,
  pickle: 92,
};

// left without a generated file on purpose
const SKIP = new Set([
  "carrot",
  "cucumber",
  "garlic",
  "greens",
  "xacho",
  "smetana",
  "beef",
  "yeast",
  "salt",
]);

function tile(hue) {
  const bg = `hsl(${hue} 40% 91%)`;
  const blob = `hsl(${hue} 38% 80%)`;
  const ring = `hsl(${hue} 34% 64%)`;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">
       <rect width="240" height="240" fill="${bg}"/>
       <circle cx="120" cy="122" r="74" fill="${blob}"/>
       <circle cx="120" cy="122" r="74" fill="none" stroke="${ring}" stroke-width="6" opacity="0.55"/>
       <circle cx="98" cy="100" r="16" fill="hsl(${hue} 30% 96%)" opacity="0.7"/>
     </svg>`,
  );
}

await mkdir(OUT, { recursive: true });

let made = 0;
let skipped = 0;
for (const [slug, cat] of Object.entries(CATEGORY)) {
  if (SKIP.has(slug)) {
    skipped++;
    continue;
  }
  const file = new URL(`${slug}.jpg`, OUT);
  await sharp(tile(HUE[cat]))
    .jpeg({ quality: 78, chromaSubsampling: "4:2:0" })
    .toFile(file.pathname);
  made++;
}

console.log(`generated ${made} images, skipped ${skipped} (fallback demo)`);
