import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "bin", "product-film-skill.mjs");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "product-film-skill-"));
const skillsRoot = path.join(temp, "skills");

function run(args) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd: temp,
    encoding: "utf8"
  });
}

const install = run(["install", "--dir", skillsRoot, "--yes"]);
assert.equal(install.status, 0, install.stderr);
const target = path.join(skillsRoot, "product-film");
assert.ok(fs.existsSync(path.join(target, "SKILL.md")));
assert.ok(fs.existsSync(path.join(target, "reference", "motion-director.md")));
assert.ok(fs.existsSync(path.join(target, "reference", "fx-arsenal.md")));

const status = run(["status", "--dir", skillsRoot, "--yes"]);
assert.equal(status.status, 0, status.stderr);
assert.match(status.stdout, /Installed version:/);

const update = run(["update", "--dir", skillsRoot, "--yes"]);
assert.equal(update.status, 0, update.stderr);

const uninstall = run(["uninstall", "--dir", skillsRoot, "--yes"]);
assert.equal(uninstall.status, 0, uninstall.stderr);
assert.equal(fs.existsSync(target), false);

fs.rmSync(temp, { recursive: true, force: true });
console.log("installer tests passed");
