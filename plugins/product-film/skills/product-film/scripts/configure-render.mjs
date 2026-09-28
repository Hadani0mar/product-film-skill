#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const configPath = path.resolve(process.argv[2] || "render.config.json");
const packagePath = path.resolve("package.json");
if (!fs.existsSync(configPath)) throw new Error("Missing render config: " + configPath);
if (!fs.existsSync(packagePath)) throw new Error("Missing package.json in current workspace.");

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
if (!config.composition) throw new Error("render config needs composition");
if (!config.duration) throw new Error("render config needs duration");

const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
pkg.scripts = pkg.scripts || {};
const cfg = path.relative(process.cwd(), configPath).replace(/\\/g, "/");
const quotedCfg = cfg.includes(" ") ? JSON.stringify(cfg) : cfg;
pkg.scripts["film:preflight"] = "node --import tsx scripts/preflight.mjs --composition " + config.composition;
pkg.scripts["film:preflight:browser"] = pkg.scripts["film:preflight"] + " --ensure-browser";
pkg.scripts["film:preview"] = "node --import tsx scripts/render.ts --config " + quotedCfg + " --profile preview";
pkg.scripts["film:render"] = "node --import tsx scripts/render.ts --config " + quotedCfg + " --profile production";
if (config.sceneMap) pkg.scripts["film:smoke"] = "node --import tsx scripts/smoke-stills.ts --map " + config.sceneMap;

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n");
console.log("Updated package scripts from " + configPath);
for (const key of Object.keys(pkg.scripts).filter((key) => key.startsWith("film:"))) {
  console.log("  " + key + " -> " + pkg.scripts[key]);
}
