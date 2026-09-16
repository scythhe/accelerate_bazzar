// Generates product tile JPGs into public/products/{slug}.jpg — a soft
// gradient card with the category's line icon centred on a plate, so a
// product without a real supplier photo still reads as "that kind of food"
// at a glance instead of an abstract colour blob.
// Run once:  node scripts/gen-product-images.mjs
// A handful of slugs are deliberately skipped so the demo also exercises the
// <img onError> fallback (image_url set, file missing).

import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = new URL("../public/products/", import.meta.url);

/** slug -> category, for the hue + icon */
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

// Same line-icon language as components/screens/CategoryIcon.tsx, redrawn
// in a 0 0 16 16 box so it can be scaled up onto the tile.
const ICON_PATHS = {
  eggs: `<ellipse cx="8" cy="9" rx="4.2" ry="5.3"/>`,
  veg: `<path d="M4 12c0-4.4 3.6-8 8-8 0 4.4-3.6 8-8 8z"/><path d="M4 12l3-3"/>`,
  fruit: `<path d="M8 5c-3 0-4.5 2.2-4.5 5S5 15 8 15s4.5-2.2 4.5-5S11 5 8 5z"/><path d="M8 5V2.5"/><path d="M8 3.5c1.2-1 2.4-1 3-1-.2 1.4-1 2-2 2"/>`,
  dairy: `<path d="M6 5h4l1.2 8.2a1 1 0 01-1 1.3H5.8a1 1 0 01-1-1.3z"/><path d="M5.6 5l.8-2h3.2l.8 2"/>`,
  meat: `<path d="M9.5 4.2a3.8 3.8 0 00-5 5.5l-2 2 1.8 1.8 2-2a3.8 3.8 0 005.5-5"/><circle cx="11" cy="5" r="1.6"/>`,
  pickle: `<rect x="5" y="5.5" width="6" height="8.5" rx="1.4"/><path d="M4.5 3.5h7v2h-7z"/>`,
  oil: `<path d="M8 2.5c3 3.6 4.3 5.8 4.3 8a4.3 4.3 0 01-8.6 0c0-2.2 1.3-4.4 4.3-8z"/>`,
  bakery: `<path d="M3 10.5a5 4 0 0110 0v2.5a1 1 0 01-1 1H4a1 1 0 01-1-1z"/><path d="M6 10.5v3M9 10.5v3"/>`,
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

function tile(hue, iconSvg) {
  const bgFrom = `hsl(${hue} 46% 93%)`;
  const bgTo = `hsl(${hue} 46% 84%)`;
  const plate = `hsl(${hue} 40% 98%)`;
  const plateEdge = `hsl(${hue} 30% 88%)`;
  const stroke = `hsl(${hue} 42% 34%)`;
  const gid = `g${hue}`;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">
       <defs>
         <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
           <stop offset="0" stop-color="${bgFrom}"/>
           <stop offset="1" stop-color="${bgTo}"/>
         </linearGradient>
       </defs>
       <rect width="240" height="240" fill="url(#${gid})"/>
       <circle cx="120" cy="122" r="78" fill="${plate}"/>
       <circle cx="120" cy="122" r="78" fill="none" stroke="${plateEdge}" stroke-width="2"/>
       <g transform="translate(46,48) scale(9)" fill="none" stroke="${stroke}"
          stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round">
         ${iconSvg}
       </g>
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
  await sharp(tile(HUE[cat], ICON_PATHS[cat]))
    .jpeg({ quality: 82, chromaSubsampling: "4:2:0" })
    .toFile(file.pathname);
  made++;
}

console.log(`generated ${made} images, skipped ${skipped} (fallback demo)`);
