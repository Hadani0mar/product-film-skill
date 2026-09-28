#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, "..");
const registryPath = path.join(skillRoot, "sources", "registry.json");
const projectRoot = process.cwd();
const sourcesRoot = path.join(projectRoot, ".motion-sources");
const lockPath = path.join(sourcesRoot, "sources-lock.json");

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const sources = registry.sources;
const byId = new Map(sources.map((s) => [s.id, s]));
const argv = process.argv.slice(2);
const command = argv.shift() || "help";

function capture(bin, args, cwd) {
  const r = spawnSync(bin, args, {cwd, encoding: "utf8", shell: false});
  if (r.error || r.status !== 0) return "";
  return (r.stdout || "").trim();
}

function run(bin, args, cwd) {
  const r = spawnSync(bin, args, {cwd, stdio: "inherit", shell: false});
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(\`\${bin} \${args.join(" ")} failed (\${r.status})\`);
}

function requireGit() {
  const r = spawnSync("git", ["--version"], {encoding: "utf8"});
  if (r.error || r.status !== 0) throw new Error("git is required to fetch component sources.");
}

function printSource(s) {
  console.log(\`\${s.id.padEnd(20)} \${s.license.padEnd(36)} \${s.categories.join(", ")}\`);
}

function selected(ids) {
  if (ids.includes("--all")) return sources.filter((s) => s.fetch === "clone");
  if (!ids.length) throw new Error("Specify source ids, or --all.");
  return ids.map((id) => {
    const s = byId.get(id);
    if (!s) throw new Error(\`Unknown source: \${id}\`);
    return s;
  });
}

function syncOne(s) {
  if (s.fetch === "package") {
    console.log(\`[package preferred] \${s.id}: install \${s.package}; clone only if source inspection is truly needed.\`);
    return null;
  }

  requireGit();
  fs.mkdirSync(sourcesRoot, {recursive: true});
  const dest = path.join(sourcesRoot, s.id);

  if (!fs.existsSync(dest)) {
    console.log(\`\\n[clone] \${s.name} -> \${dest}\`);
    run("git", ["clone", "--depth", "1", "--branch", s.branch, s.url, dest], projectRoot);
  } else {
    const dirty = capture("git", ["status", "--porcelain"], dest);
    if (dirty) {
      console.warn(\`\\n[skip update] \${s.id} has local changes; leaving them untouched.\`);
    } else {
      console.log(\`\\n[update] \${s.name}\`);
      run("git", ["fetch", "--depth", "1", "origin", s.branch], dest);
      run("git", ["checkout", s.branch], dest);
      run("git", ["reset", "--hard", \`origin/\${s.branch}\`], dest);
    }
  }

  return {
    id: s.id,
    repo: s.repo,
    commit: capture("git", ["rev-parse", "HEAD"], dest),
    license: s.license,
    redistribution: s.redistribution,
    syncedAt: new Date().toISOString()
  };
}

function readLock() {
  if (!fs.existsSync(lockPath)) return {schemaVersion: 1, sources: {}};
  try { return JSON.parse(fs.readFileSync(lockPath, "utf8")); }
  catch { return {schemaVersion: 1, sources: {}}; }
}

function writeLock(entries) {
  const lock = readLock();
  for (const e of entries.filter(Boolean)) lock.sources[e.id] = e;
  fs.mkdirSync(sourcesRoot, {recursive: true});
  fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + "\\n");
  console.log(\`\\nSource lock: \${lockPath}\`);
}

function find(term) {
  if (!fs.existsSync(sourcesRoot)) {
    console.log("No local sources yet. Run: node <skill>/scripts/source-manager.mjs sync <id>");
    return;
  }

  for (const s of sources) {
    const dir = path.join(sourcesRoot, s.id);
    if (!fs.existsSync(dir)) continue;

    console.log(\`\\n=== \${s.name} (\${s.id}) ===\`);
    const r = spawnSync("git", ["grep", "-I", "-n", "-i", "--", term], {
      cwd: dir,
      encoding: "utf8",
      maxBuffer: 5 * 1024 * 1024
    });

    const lines = (r.stdout || "").split("\\n").filter(Boolean).slice(0, 40);
    if (lines.length) lines.forEach((line) => console.log(line));
    else console.log("(no text matches)");
  }
}

switch (command) {
  case "list": {
    const category = argv[0]?.toLowerCase();
    sources
      .filter((s) => !category || s.categories.some((c) => c.toLowerCase().includes(category)))
      .sort((a, b) => b.priority - a.priority)
      .forEach(printSource);
    break;
  }

  case "info": {
    const s = byId.get(argv[0]);
    if (!s) throw new Error(\`Unknown source: \${argv[0] || "(missing id)"}\`);
    console.log(JSON.stringify(s, null, 2));
    break;
  }

  case "sync": {
    const entries = selected(argv).map(syncOne);
    writeLock(entries);
    break;
  }

  case "find": {
    const term = argv.join(" ").trim();
    if (!term) throw new Error('Usage: source-manager.mjs find "button"');
    find(term);
    break;
  }

  default:
    console.log(\`Component source manager

Commands:
  list [category]
  info <id>
  sync <id...>
  sync --all
  find <term>

Examples:
  node scripts/source-manager.mjs list background
  node scripts/source-manager.mjs sync react-bits magic-ui motion-primitives
  node scripts/source-manager.mjs find "button"
\`);
}
