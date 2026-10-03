/** Chip spec metinlerini sayısal değerlere çözer. */
export function parseTransistors(v) {
  if (!v) return null;
  const s = String(v);
  const b = s.match(/([\d.,]+)\s*(?:milyar|billion|B)\b/i);
  if (b) return parseFloat(b[1].replace(",", "")) * 1e9;
  const t = s.match(/([\d.,]+)\s*(?:trilyon|trillion|T)\b/i);
  if (t) return parseFloat(t[1].replace(",", "")) * 1e12;
  return null;
}
export function parseArea(v) {
  if (!v) return null;
  const m = String(v).match(/([\d.,]+)\s*mm/i);
  return m ? parseFloat(m[1].replace(",", "")) : null;
}
export function parseWatts(v) {
  if (!v) return null;
  const m = String(v).match(/([\d.,]+)\s*W/i);
  return m ? parseFloat(m[1].replace(",", "")) : null;
}
export function parseBandwidth(v) {
  if (!v) return null;
  const s = String(v);
  const tb = s.match(/([\d.,]+)\s*TB\/s/i);
  if (tb) return parseFloat(tb[1].replace(",", "")) * 1000;
  const gb = s.match(/([\d.,]+)\s*GB\/s/i);
  return gb ? parseFloat(gb[1].replace(",", "")) : null;
}
const MULTI_DIE_ISARETLERI = /×|\+|çift die|toplam|chiplet|ccd|iod|tile|paket|xcd|mcd|stacked/i;
export function isMultiDie(chip) {
  const t = String(chip.transistor_count || "");
  const d = String(chip.die_size || "");
  return MULTI_DIE_ISARETLERI.test(t) || MULTI_DIE_ISARETLERI.test(d);
}
