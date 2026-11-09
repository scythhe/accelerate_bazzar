// One-off: fetch real product photography from Wikimedia Commons (freely
// licensed) for each canonical item, centre-crop to a square, and save into
// public/products/{slug}.jpg — replacing the icon-tile placeholders.
// Run:  node scripts/fetch-product-photos.mjs
// Search hits vary, and some photos were then hand-picked to match the product
// (beer, vodka, chacha, tkemali, buckwheat, soy-sauce, ghomi, ketchup, rice and
// others), so pass slugs and check the results instead of re-running everything.

import sharp from "sharp";
import { fileURLToPath } from "node:url";

const OUT = new URL("../public/products/", import.meta.url);

const QUERY = {
  eggs: "chicken eggs carton",
  onion: "yellow onions pile",
  potato: "raw potatoes tubers",
  carrot: "carrots bunch",
  cabbage: "white cabbage vegetable",
  tomato: "tomatoes red",
  cucumber: "cucumbers fresh",
  garlic: "garlic bulbs",
  greens: "fresh herbs bunch",
  apple: "red apples",
  lemon: "lemons fruit",
  banana: "bananas bunch",
  orange: "oranges fruit",
  sulguni: "sulguni georgian cheese",
  imeruli: "imeruli georgian cheese",
  butter: "butter block",
  matsoni: "matsoni georgian yogurt",
  smetana: "sour cream",
  xacho: "georgian cheese",
  milk: "milk bottle",
  chicken: "raw whole chicken",
  "chicken-fillet": "raw chicken breast meat",
  pork: "raw pork meat",
  beef: "raw beef steak meat",
  flour: "wheat flour bag",
  sugar: "granulated white sugar bowl",
  salt: "salt pile",
  rice: "white rice grains",
  pasta: "dried pasta",
  yeast: "yeast",
  "oil-sunflower": "sunflower oil bottle",
  "oil-olive": "olive oil bottle",
  "pickle-cucumber": "pickled cucumbers jar",
  jonjoli: "pickled bladdernut jonjoli",
  "pickled-cabbage": "pickled cabbage jar",
  "wine-red": "glass of red wine",
  "wine-white": "glass of white wine",
  beer: "beer bottles",
  vodka: "shot glass vodka",
  chacha: "grappa glass",
  cognac: "brandy snifter glass",
  napkins: "paper napkins stack",
  "toilet-paper": "toilet paper rolls",
  "paper-towels": "paper towel roll kitchen",
  "wet-wipes": "wet wipes package",
  "liquid-soap": "liquid soap dispenser",
  "dish-soap": "washing up liquid",
  gloves: "disposable nitrile gloves",
  buckwheat: "buckwheat groats",
  lentils: "red lentils",
  beans: "red kidney beans",
  ghomi: "millet grains",
  oats: "rolled oats",
  semolina: "semolina",
  tkemali: "tkemali sauce",
  ketchup: "ketchup",
  mayonnaise: "homemade mayonnaise",
  mustard: "dijon mustard spoon",
  adjika: "adjika sauce",
  "soy-sauce": "soy sauce bottle",
};

const BAD = /(map|flag|logo|icon|stamp|coin|drawing|diagram|clip ?art|cartoon|chart|graph|banknote|coat of arms|postcard)/i;
const UA = "AccelerateDemo/1.0 (pitch-deck prototype; contact: nikoloz.berdznishvili.1@btu.edu.ge)";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getJson(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
    if (res.status === 429) {
      await sleep(2500 * (i + 1));
      continue;
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      await sleep(2000 * (i + 1));
    }
  }
  throw new Error("rate-limited / bad response after retries");
}

async function searchTitle(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=10&format=json&srsearch=${encodeURIComponent(query + " filetype:bitmap")}`;
  const data = await getJson(url);
  const hits = data?.query?.search ?? [];
  for (const h of hits) {
    if (!BAD.test(h.title) && /\.(jpe?g|png)$/i.test(h.title)) return h.title;
  }
  return hits[0]?.title;
}

async function thumbUrl(title, width = 640) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json`;
  const data = await getJson(url);
  const pages = data?.query?.pages ?? {};
  const page = Object.values(pages)[0];
  const info = page?.imageinfo?.[0];
  return info?.thumburl ?? info?.url;
}

const only = process.argv.slice(2);
const entries = only.length
  ? Object.entries(QUERY).filter(([slug]) => only.includes(slug))
  : Object.entries(QUERY);

let ok = 0;
let fail = 0;
for (const [slug, query] of entries) {
  try {
    const title = await searchTitle(query);
    if (!title) throw new Error("no search result");
    const src = await thumbUrl(title, 640);
    if (!src) throw new Error("no thumb url");
    const res = await fetch(src, { headers: { "User-Agent": "AccelerateDemo/1.0" } });
    if (!res.ok) throw new Error(`fetch ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const out = new URL(`${slug}.jpg`, OUT);
    await sharp(buf)
      .resize(480, 480, { fit: "cover", position: "attention" })
      .jpeg({ quality: 80, chromaSubsampling: "4:2:0" })
      .toFile(fileURLToPath(out));
    console.log(`✓ ${slug} <- ${title}`);
    ok++;
  } catch (err) {
    console.log(`✗ ${slug}: ${err.message}`);
    fail++;
  }
  await sleep(600);
}
console.log(`done: ${ok} ok, ${fail} failed`);
