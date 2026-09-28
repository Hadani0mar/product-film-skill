#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {createRequire} from "node:module";
import {spawnSync} from "node:child_process";

const cwd = process.cwd();
const argv = process.argv.slice(2);
const command = argv.shift() || "help";

function detectPackageManager() {
  if (fs.existsSync(path.join(cwd, "bun.lockb")) || fs.existsSync(path.join(cwd, "bun.lock"))) return "bun";
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

function projectRequire() {
  const pkg = path.join(cwd, "package.json");
  if (!fs.existsSync(pkg)) throw new Error("Run this from a Node/React/Remotion project with package.json.");
  return createRequire(pkg);
}

function installPhosphor() {
  const pm = detectPackageManager();
  const packages = ["@phosphor-icons/react", "@phosphor-icons/core"];
  const args = pm === "npm" ? ["install", ...packages] : ["add", ...packages];
  console.log("Installing Phosphor icon packages with " + pm + "...");
  const result = spawnSync(pm, args, {cwd, stdio: "inherit"});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(pm + " install failed with status " + result.status);
}

function loadCore(allowInstall = false) {
  try {
    return projectRequire()("@phosphor-icons/core");
  } catch (error) {
    if (!allowInstall) {
      throw new Error("Missing @phosphor-icons/core. Run: node <skill>/scripts/icon-search.mjs ensure");
    }
    installPhosphor();
    return projectRequire()("@phosphor-icons/core");
  }
}

function tokens(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function scoreIcon(icon, queryTokens) {
  const name = tokens(icon.name);
  const tags = (icon.tags || []).flatMap(tokens);
  const categories = (icon.categories || []).flatMap(tokens);
  const all = new Set([...name, ...tags, ...categories]);
  let score = 0;
  for (const token of queryTokens) {
    if (name.includes(token)) score += 8;
    if (categories.includes(token)) score += 5;
    if (tags.includes(token)) score += 3;
    for (const word of all) {
      if (word.startsWith(token) || token.startsWith(word)) score += 1;
    }
  }
  const phrase = queryTokens.join("-");
  if (icon.name === phrase) score += 20;
  if (icon.name.includes(phrase)) score += 8;
  return score;
}

function reactImport(icon) {
  const component = icon.pascal_name + "Icon";
  return 'import {' + component + '} from "@phosphor-icons/react/dist/csr/' + icon.pascal_name + '";';
}

function search(query, limit) {
  const core = loadCore(false);
  const queryTokens = tokens(query);
  if (!queryTokens.length) throw new Error("Search query is empty.");
  const results = core.icons
    .map((icon) => ({icon, score: scoreIcon(icon, queryTokens)}))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.icon.name.localeCompare(b.icon.name))
    .slice(0, limit);

  if (!results.length) {
    console.log("No matching icons.");
    return;
  }

  console.log("\nPhosphor matches for: \"" + query + "\"\n");
  for (const item of results) {
    const icon = item.icon;
    console.log(String(item.score).padStart(3) + "  " + icon.pascal_name + "Icon");
    console.log("     name: " + icon.name);
    console.log("     categories: " + ((icon.categories || []).join(", ") || "-"));
    console.log("     tags: " + ((icon.tags || []).slice(0, 10).join(", ") || "-"));
    console.log("     import: " + reactImport(icon));
    console.log("");
  }
}

function info(name) {
  const core = loadCore(false);
  const normalized = String(name || "").toLowerCase();
  const icon = core.icons.find((item) =>
    item.name.toLowerCase() === normalized ||
    item.pascal_name.toLowerCase() === normalized ||
    (item.pascal_name + "Icon").toLowerCase() === normalized
  );
  if (!icon) throw new Error("Icon not found: " + name);
  console.log(JSON.stringify(icon, null, 2));
  console.log("\nReact import:\n" + reactImport(icon));
}

switch (command) {
  case "ensure":
    loadCore(true);
    console.log("Phosphor icon system ready.");
    break;
  case "search": {
    const limitIndex = argv.indexOf("--limit");
    let limit = 15;
    if (limitIndex >= 0) {
      limit = Number(argv[limitIndex + 1]) || 15;
      argv.splice(limitIndex, 2);
    }
    search(argv.join(" "), limit);
    break;
  }
  case "info":
    info(argv.join(" "));
    break;
  default:
    console.log([
      "Phosphor icon search",
      "",
      "Commands:",
      "  ensure",
      "  search <query> [--limit 15]",
      "  info <icon-name-or-component>",
      "",
      "Examples:",
      "  node scripts/icon-search.mjs ensure",
      "  node scripts/icon-search.mjs search database",
      "  node scripts/icon-search.mjs search \"debt notification\"",
      "  node scripts/icon-search.mjs search delivery --limit 8",
      "  node scripts/icon-search.mjs info bell-simple"
    ].join("\n"));
}
