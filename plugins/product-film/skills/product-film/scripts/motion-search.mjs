#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, "..");
const registryPath = path.join(skillRoot, "sources", "motion-registry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const motions = registry.motions || [];
const args = process.argv.slice(2);
const command = args.shift() || "help";

function words(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function tokenMatch(token, candidate) {
  return candidate === token || candidate.startsWith(token) || token.startsWith(candidate);
}

function relevance(motion, tokens) {
  const fields = {
    name: words(motion.name),
    categories: (motion.categories || []).flatMap(words),
    useFor: (motion.useFor || []).flatMap(words),
    notes: words(motion.notes || ""),
    source: words(motion.source || "")
  };

  let raw = 0;
  for (const token of tokens) {
    if (fields.name.some((x) => tokenMatch(token, x))) raw += 18;
    if (fields.categories.some((x) => tokenMatch(token, x))) raw += 16;
    if (fields.useFor.some((x) => tokenMatch(token, x))) raw += 14;
    if (fields.notes.some((x) => tokenMatch(token, x))) raw += 5;
    if (fields.source.some((x) => tokenMatch(token, x))) raw += 3;
  }
  return Math.min(100, raw);
}

function weightedQuality(m) {
  return (
    (m.popularity || 0) * 0.25 +
    (m.quality || 0) * 0.20 +
    (m.remotionFit || 0) * 0.20 +
    (m.productFilmFit || 0) * 0.15 +
    (m.freshness || 0) * 0.10 +
    (m.licenseSafety || 0) * 0.10
  );
}

function finalScore(m, rel) {
  return Math.max(
    0,
    Math.min(100, rel * 0.45 + weightedQuality(m) * 0.55 - (m.implementationCost || 0) * 0.08)
  );
}

function print(m, rel = null, score = null) {
  const prefix = score == null ? "" : String(Math.round(score * 10) / 10).padStart(5) + "  ";
  console.log(prefix + m.id + " — " + m.name);
  console.log("      source: " + m.source + " | signal: " + JSON.stringify(m.signal || {}));
  if (rel != null) console.log("      relevance: " + Math.round(rel) + "/100");
  console.log("      popularity: " + m.popularity + " | quality: " + m.quality + " | remotion: " + m.remotionFit + " | product-film: " + m.productFilmFit);
  console.log("      license safety: " + m.licenseSafety + " | implementation cost: " + m.implementationCost);
  console.log("      categories: " + (m.categories || []).join(", "));
  console.log("      use for: " + (m.useFor || []).join(", "));
  console.log("      url: " + m.url);
  if (m.notes) console.log("      note: " + m.notes);
  console.log("");
}

function search(query, limit = 8) {
  const tokens = words(query);
  if (!tokens.length) throw new Error("Search query is empty.");

  const ranked = motions
    .map((m) => {
      const rel = relevance(m, tokens);
      return {m, rel, score: finalScore(m, rel)};
    })
    .filter((x) => x.rel > 0)
    .sort((a, b) => b.score - a.score || b.rel - a.rel || b.m.quality - a.m.quality)
    .slice(0, limit);

  if (!ranked.length) {
    console.log("No matching motion patterns. Fall back to shot-recipes.md and product-native motion.");
    return;
  }

  console.log('\nMotion Intelligence results for: "' + query + '"\n');
  ranked.forEach((x) => print(x.m, x.rel, x.score));
}

function list(filter) {
  motions
    .filter((m) => {
      if (!filter) return true;
      const needle = filter.toLowerCase();
      return [
        m.source,
        ...(m.categories || []),
        ...(m.useFor || [])
      ].some((x) => String(x).toLowerCase().includes(needle));
    })
    .sort((a, b) => weightedQuality(b) - weightedQuality(a))
    .forEach((m) => print(m));
}

function info(id) {
  const m = motions.find((x) => x.id === id);
  if (!m) throw new Error("Unknown motion id: " + id);
  print(m);
}

function validate() {
  const ids = new Set();
  const required = [
    "id","name","source","categories","useFor","popularity","quality","freshness",
    "remotionFit","productFilmFit","licenseSafety","implementationCost","url"
  ];
  const numeric = ["popularity","quality","freshness","remotionFit","productFilmFit","licenseSafety","implementationCost"];

  for (const m of motions) {
    for (const key of required) {
      if (m[key] == null) throw new Error(m.id + ": missing " + key);
    }
    if (ids.has(m.id)) throw new Error("Duplicate id: " + m.id);
    ids.add(m.id);
    for (const key of numeric) {
      if (typeof m[key] !== "number" || m[key] < 0 || m[key] > 100) {
        throw new Error(m.id + ": " + key + " must be 0..100");
      }
    }
  }

  const sourceIds = new Set((registry.sourceCatalog || []).map((s) => s.id));
  for (const m of motions) {
    if (!sourceIds.has(m.source)) throw new Error(m.id + ": unknown source " + m.source);
  }

  console.log("motion registry valid: " + motions.length + " entries");
}

switch (command) {
  case "search": {
    const limitIndex = args.indexOf("--limit");
    let limit = 8;
    if (limitIndex >= 0) {
      limit = Number(args[limitIndex + 1]) || 8;
      args.splice(limitIndex, 2);
    }
    search(args.join(" "), limit);
    break;
  }
  case "list":
    list(args[0]);
    break;
  case "info":
    info(args[0]);
    break;
  case "validate":
    validate();
    break;
  default:
    console.log([
      "Motion Intelligence search",
      "",
      "Commands:",
      "  search <query> [--limit 8]",
      "  list [category|source|use-case]",
      "  info <motion-id>",
      "  validate",
      "",
      "Examples:",
      '  node scripts/motion-search.mjs search "debt notification phone"',
      '  node scripts/motion-search.mjs search "kinetic typography launch"',
      '  node scripts/motion-search.mjs search "3d hero orbit"',
      '  node scripts/motion-search.mjs list notification',
      "  node scripts/motion-search.mjs info motion-ios-notifications"
    ].join("\n"));
}

