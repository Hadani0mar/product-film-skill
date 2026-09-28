#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const command = args.shift() || "help";

function take(flag, fallback) {
  const index = args.indexOf(flag);
  if (index === -1) return fallback;
  const result = args[index + 1];
  args.splice(index, 2);
  return result;
}
function has(flag) { return args.includes(flag); }

const file = path.resolve(take("--file", "videos/SOURCES.json"));
const empty = () => ({schemaVersion:1, updatedAt:new Date().toISOString(), sources:[]});
const read = () => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : empty();
const write = (data) => {
  data.updatedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(file), {recursive:true});
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
};

if (command === "init") {
  if (!fs.existsSync(file)) write(empty());
  console.log(file);
  process.exit(0);
}

if (command === "add") {
  const data = read();
  const id = take("--id");
  const source = take("--source");
  const upstreamPath = take("--path", "");
  const license = take("--license");
  const adaptation = take("--adaptation", "none");
  const reason = take("--reason", "");
  const deterministicTwin = has("--twin");
  const bespoke = has("--bespoke");
  if (!id) throw new Error("--id is required");
  if (!source && !bespoke) throw new Error("--source is required unless --bespoke is used");
  if (!license && !bespoke) throw new Error("--license is required unless --bespoke is used");
  if (bespoke && !reason) throw new Error("--bespoke requires --reason");
  const entry = {id, source:source || "bespoke", upstreamPath, license:license || "original", adaptation, deterministicTwin, bespoke, reason};
  const index = data.sources.findIndex((item) => item.id === id);
  if (index >= 0) data.sources[index] = entry; else data.sources.push(entry);
  write(data);
  console.log("recorded " + id + " -> " + file);
  process.exit(0);
}

if (command === "validate") {
  const data = read();
  const problems = [];
  for (const item of data.sources) {
    if (!item.id) problems.push("entry missing id");
    if (!item.bespoke && (!item.source || item.source === "bespoke")) problems.push(item.id + ": missing source");
    if (!item.bespoke && !item.license) problems.push(item.id + ": missing license");
    if (item.bespoke && !item.reason) problems.push(item.id + ": bespoke component has no recorded reason");
    if (item.deterministicTwin && (!item.adaptation || item.adaptation === "none")) problems.push(item.id + ": deterministic twin has no adaptation note");
  }
  console.log(String(data.sources.length) + " source record(s), " + String(problems.length) + " problem(s)");
  for (const problem of problems) console.log("- " + problem);
  process.exit(problems.length ? 1 : 0);
}

console.log([
  "Source provenance manifest",
  "",
  "Commands:",
  "  init [--file videos/SOURCES.json]",
  "  add --id <name> --source <repo/url> --path <upstream-path> --license <license> [--adaptation note] [--twin]",
  "  add --id <name> --bespoke --reason <why no approved source fit>",
  "  validate [--file videos/SOURCES.json]"
].join("\n"));
