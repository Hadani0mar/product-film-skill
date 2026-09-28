#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, "..");
const registryPath = path.join(skillRoot, "sources", "example-registry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const examples = registry.examples || [];
const args = process.argv.slice(2);
const command = args.shift() || "help";

function words(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function score(example, tokens) {
  const fields = {
    name: words(example.name),
    categories: (example.categories || []).flatMap(words),
    techniques: (example.techniques || []).flatMap(words),
    useFor: (example.useFor || []).flatMap(words),
    notes: words(example.notes || ""),
    repo: words(example.repo || ""),
  };

  let total = 0;
  for (const token of tokens) {
    if (fields.name.includes(token)) total += 10;
    if (fields.categories.includes(token)) total += 8;
    if (fields.techniques.includes(token)) total += 7;
    if (fields.useFor.includes(token)) total += 6;
    if (fields.notes.includes(token)) total += 2;
    if (fields.repo.includes(token)) total += 2;

    const all = new Set(Object.values(fields).flat());
    for (const word of all) {
      if (word.startsWith(token) || token.startsWith(word)) total += 0.5;
    }
  }

  return total + (example.priority || 0) / 100;
}

function printExample(example, rankScore = null) {
  const scoreLabel = rankScore == null ? "" : String(Math.round(rankScore * 10) / 10).padStart(5) + "  ";
  console.log(scoreLabel + example.id + " — " + example.name);
  console.log("      source: " + (example.repo || example.url));
  console.log("      license: " + example.license + " | reuse: " + example.reusePolicy);
  console.log("      categories: " + (example.categories || []).join(", "));
  console.log("      techniques: " + (example.techniques || []).join(", "));
  console.log("      use for: " + (example.useFor || []).join(", "));
  console.log("      url: " + example.url);
  if (example.previewUrl) console.log("      preview: " + example.previewUrl);
  if (example.notes) console.log("      note: " + example.notes);
  console.log("");
}

function search(query, limit = 8) {
  const tokens = words(query);
  if (!tokens.length) throw new Error("Search query is empty.");

  const results = examples
    .map((example) => ({example, score: score(example, tokens)}))
    .filter((item) => item.score > 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (!results.length) {
    console.log("No matching motion examples.");
    return;
  }

  console.log('\nMotion references for: "' + query + '"\n');
  for (const item of results) printExample(item.example, item.score);
}

function info(id) {
  const example = examples.find((item) => item.id === id);
  if (!example) throw new Error("Unknown example id: " + id);
  printExample(example);
}

function list(filter) {
  examples
    .filter((example) => {
      if (!filter) return true;
      const needle = filter.toLowerCase();
      return [
        example.sourceType,
        example.license,
        example.reusePolicy,
        ...(example.categories || []),
      ].some((x) => String(x).toLowerCase().includes(needle));
    })
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .forEach((example) => printExample(example));
}

function sync(id) {
  const example = examples.find((item) => item.id === id);
  if (!example) throw new Error("Unknown example id: " + id);
  if (!example.repo) throw new Error(id + " is a gallery/web reference and has no Git repository to clone.");

  if (!["code-adaptation-allowed-with-notice","workflow-and-code-adaptation-allowed-with-notice","principles-and-code-adaptation-allowed-with-notice"].includes(example.reusePolicy)) {
    throw new Error("Refusing to clone for code reuse: " + example.reusePolicy);
  }

  const cache = path.join(process.cwd(), ".motion-examples");
  const dest = path.join(cache, id);
  fs.mkdirSync(cache, {recursive:true});

  if (!fs.existsSync(dest)) {
    const r = spawnSync("git", ["clone", "--depth", "1", "https://github.com/" + example.repo + ".git", dest], {stdio:"inherit"});
    if (r.error) throw r.error;
    if (r.status !== 0) throw new Error("git clone failed");
  } else {
    console.log("Already fetched: " + dest);
  }

  console.log("\nInspect locally, copy only the needed technique, and preserve required notices.");
  console.log(dest);
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
  case "sync":
    sync(args[0]);
    break;
  default:
    console.log([
      "Motion example search",
      "",
      "Commands:",
      "  search <query> [--limit 8]",
      "  list [category|license|reuse-policy]",
      "  info <example-id>",
      "  sync <example-id>",
      "",
      "Examples:",
      '  node scripts/example-search.mjs search "product demo cursor"',
      '  node scripts/example-search.mjs search "integration logos grid"',
      '  node scripts/example-search.mjs search "notification alert"',
      "  node scripts/example-search.mjs list product-demo",
      "  node scripts/example-search.mjs info agentic-product-demo",
      "  node scripts/example-search.mjs sync agentic-product-demo",
    ].join("\n"));
}
