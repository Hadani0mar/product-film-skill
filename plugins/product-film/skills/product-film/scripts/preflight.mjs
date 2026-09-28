#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {createRequire} from "node:module";

const root = process.cwd();
const argv = process.argv.slice(2);
const has = (flag) => argv.includes(flag);
const value = (flag, fallback) => {
  const index = argv.indexOf(flag);
  return index === -1 ? fallback : argv[index + 1];
};

const entry = value("--entry", "src/index.ts");
const composition = value("--composition", undefined);
const props = value("--props", "{}");
const ensureBrowser = has("--ensure-browser");
const reportPath = path.resolve(value("--report", "out/preflight.json"));
const checks = [];

function add(name, ok, detail, level) {
  const resolvedLevel = level || (ok ? "pass" : "error");
  checks.push({name, ok, level: resolvedLevel, detail});
  const glyph = ok ? "✓" : resolvedLevel === "warning" ? "!" : "✗";
  console.log(glyph + " " + name + ": " + detail);
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {cwd: root, encoding: "utf8", shell: false, ...options});
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else if (/\.(tsx?|jsx?)$/.test(name)) out.push(full);
  }
  return out;
}

const nodeMajor = Number(process.versions.node.split(".")[0]);
add("Node", nodeMajor >= 18, process.versions.node + (nodeMajor >= 18 ? "" : " (need Node 18+)"));
add("package.json", fs.existsSync(path.join(root, "package.json")), path.join(root, "package.json"));
add("entry", fs.existsSync(path.resolve(root, entry)), entry);

try {
  const interfaces = os.networkInterfaces();
  add("network interfaces", true, String(Object.keys(interfaces).length) + " interface group(s) visible");
} catch (error) {
  const restricted = error && (error.code === "EPERM" || error.code === "EACCES");
  add(
    "network interfaces",
    false,
    restricted
      ? 'restricted by sandbox. Retry with NODE_OPTIONS="-r ./scripts/network-compat.cjs". The shim exposes loopback only and remains opt-in.'
      : String(error),
    restricted ? "warning" : "error",
  );
}

let req;
try {
  req = createRequire(path.join(root, "package.json"));
} catch {
  req = createRequire(import.meta.url);
}

for (const packageName of ["react", "remotion", "@remotion/renderer", "@remotion/bundler"]) {
  try {
    req.resolve(packageName);
    add(packageName, true, "installed");
  } catch {
    add(packageName, false, "not resolvable from this workspace");
  }
}

try {
  const tsc = req.resolve("typescript/bin/tsc");
  const result = run(process.execPath, [tsc, "--noEmit"]);
  add("TypeScript", result.status === 0, result.status === 0 ? "tsc --noEmit passed" : String(result.stderr || result.stdout || "tsc failed").trim().slice(-1200));
} catch {
  add("TypeScript", false, "typescript is not installed in the video workspace");
}

const sourceFiles = walk(path.join(root, "src"));
const missingAssets = [];
const rootUrlWarnings = [];
const expensiveEffects = [];
for (const file of sourceFiles) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(/staticFile\(\s*["\']([^"\']+)["\']\s*\)/g)) {
    const asset = match[1].replace(/^\/+/, "");
    if (!fs.existsSync(path.join(root, "public", asset))) missingAssets.push(path.relative(root, file) + " -> public/" + asset);
  }
  for (const match of source.matchAll(/\bsrc\s*=\s*["\']\/([^"\']+)["\']/g)) {
    rootUrlWarnings.push(path.relative(root, file) + " -> /" + match[1] + " (prefer staticFile() + <Img> for public render assets)");
  }
  if (/backdrop-filter|backdropFilter/.test(source)) expensiveEffects.push(path.relative(root, file));
}
add("public assets", missingAssets.length === 0, missingAssets.length ? missingAssets.join("; ") : "all literal staticFile() assets exist");
if (rootUrlWarnings.length) add("root public URLs", false, rootUrlWarnings.slice(0, 12).join("; "), "warning");
if (expensiveEffects.length) add("headless render cost", false, "backdrop-filter found in " + [...new Set(expensiveEffects)].join(", ") + ". Keep it opt-in for long production renders.", "warning");

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const listed = run(npx, ["remotion", "compositions", entry, "--props", props]);
add("Remotion compositions", listed.status === 0, listed.status === 0 ? "composition listing passed" : String(listed.stderr || listed.stdout || "listing failed").trim().slice(-1200));
if (composition && listed.status === 0) {
  const output = String(listed.stdout || "") + "\n" + String(listed.stderr || "");
  add("requested composition", output.includes(composition), composition);
}

if (ensureBrowser) {
  const browser = run(npx, ["remotion", "browser", "ensure"]);
  add("Headless Chrome", browser.status === 0, browser.status === 0 ? "browser ensure passed" : String(browser.stderr || browser.stdout || "browser acquisition failed").trim().slice(-1200));
} else {
  add("Headless Chrome", true, "dry check only; rerun with --ensure-browser before a long render", "warning");
}

const errors = checks.filter((check) => check.level === "error" && !check.ok);
const warnings = checks.filter((check) => check.level === "warning");
const report = {generatedAt: new Date().toISOString(), cwd: root, entry, composition, ok: errors.length === 0, errors: errors.length, warnings: warnings.length, checks};
fs.mkdirSync(path.dirname(reportPath), {recursive: true});
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
console.log("\nPreflight report: " + reportPath);
console.log(String(errors.length) + " error(s), " + String(warnings.length) + " warning(s)");
process.exit(errors.length ? 1 : 0);
