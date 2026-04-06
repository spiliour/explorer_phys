import fs from "node:fs";
import path from "node:path";

const INPUT = process.argv[2] ?? "src/data/inspiration_library.csv";
const OUTPUT = process.argv[3] ?? "src/data/inspiration_library.json";

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (c === '"' && next === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
      continue;
    }
    if (c === '"') { inQuotes = true; }
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c === "\r") { /* ignore */ }
    else { field += c; }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

function trim(v) {
  if (v == null) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

function parseTags(v) {
  const s = trim(v);
  if (!s) return [];
  return s.split(";").map(t => t.trim()).filter(Boolean);
}

const csvText = fs.readFileSync(INPUT, "utf8").replace(/^\uFEFF/, ""); // strip BOM
const rows = parseCSV(csvText);
const header = rows[0].map(h => h.trim());
const idx = Object.fromEntries(header.map((h, i) => [h, i]));

const items = rows.slice(1)
  .filter(r => r.some(c => String(c ?? "").trim().length > 0))
  .map(r => {
    const id = trim(r[idx.id]);
    if (!id) return null;
    return {
      id,
      title: trim(r[idx.title]),
      creator: trim(r[idx.creator]),
      profile: trim(r[idx.profile]),
      physical: parseTags(r[idx.physical]),
      mechanisms: parseTags(r[idx.mechanisms]),
      link: trim(r[idx.link]),
      image: `inspiration/${id}.png`,
    };
  })
  .filter(Boolean);

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify(items, null, 2) + "\n", "utf8");
console.log(`✅ Wrote ${items.length} items to ${OUTPUT}`);
