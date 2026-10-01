#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const skillSource = path.join(packageRoot, "plugins", "product-film", "skills", "product-film");
const skillName = "product-film";

const argv = process.argv.slice(2);
const command = argv.find((arg) => !arg.startsWith("-")) || "install";

const has = (flag) => argv.includes(flag);
const valueOf = (flag) => {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : undefined;
};

const HELP = `
Product Film Skill installer

Usage:
  npx product-film-skill
  npx product-film-skill install
  npx product-film-skill update
  npx product-film-skill status
  npx product-film-skill uninstall

Options:
  --agent <claude|codex|opencode|agy|agents>
  --scope <global|project>
  --dir <path>          Install into a custom skills root
  --force               Replace an existing installation
  --yes, -y             Accept defaults / skip confirmation
  --dry-run             Print actions without writing
  --help, -h
  --version, -v

Examples:
  npx product-film-skill
  npx product-film-skill --agent claude --scope global
  npx product-film-skill --agent codex --scope global
  npx product-film-skill --agent opencode --scope project
  npx product-film-skill --agent agents --scope project
`.trim();

function readPackageVersion() {
  const json = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
  return json.version;
}

function expandHome(p) {
  if (!p) return p;
  return p.startsWith("~/") || p.startsWith("~\\")
    ? path.join(os.homedir(), p.slice(2))
    : p;
}

function targetRoot(agent, scope) {
  const home = os.homedir();
  const cwd = process.cwd();
  const roots = {
    claude: {
      global: path.join(home, ".claude", "skills"),
      project: path.join(cwd, ".claude", "skills")
    },
    codex: {
      global: path.join(process.env.CODEX_HOME || path.join(home, ".codex"), "skills"),
      project: path.join(cwd, ".agents", "skills")
    },
    opencode: {
      global: path.join(home, ".config", "opencode", "skills"),
      project: path.join(cwd, ".opencode", "skills")
    },
    agy: {
      global: path.join(home, ".gemini", "antigravity-cli", "skills"),
      project: path.join(cwd, ".agents", "skills")
    },
    agents: {
      global: path.join(home, ".agents", "skills"),
      project: path.join(cwd, ".agents", "skills")
    }
  };
  return roots[agent][scope];
}

function validateAgent(agent) {
  const allowed = ["claude", "codex", "opencode", "agy", "agents"];
  if (!allowed.includes(agent)) {
    throw new Error(`Unknown agent "${agent}". Use one of: ${allowed.join(", ")}`);
  }
}

function validateScope(scope) {
  if (!["global", "project"].includes(scope)) {
    throw new Error('Unknown scope. Use "global" or "project".');
  }
}

async function promptChoice(rl, question, choices, defaultIndex = 0) {
  const lines = choices.map((c, i) => `  ${i + 1}) ${c.label}`).join("\n");
  const answer = await rl.question(`${question}\n${lines}\nChoose [${defaultIndex + 1}]: `);
  const n = answer.trim() === "" ? defaultIndex + 1 : Number(answer.trim());
  if (!Number.isInteger(n) || n < 1 || n > choices.length) {
    throw new Error("Invalid selection.");
  }
  return choices[n - 1].value;
}

async function resolveTarget() {
  const customDir = valueOf("--dir");
  let agent = valueOf("--agent");
  let scope = valueOf("--scope");

  const nonInteractive = has("--yes") || has("-y") || !process.stdin.isTTY;

  if (!agent) {
    if (nonInteractive) agent = "claude";
    else {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      try {
        agent = await promptChoice(rl, "Install Product Film for:", [
          { label: "Claude Code", value: "claude" },
          { label: "OpenAI Codex", value: "codex" },
          { label: "OpenCode", value: "opencode" },
          { label: "Google Antigravity (agy)", value: "agy" },
          { label: "Universal .agents/skills", value: "agents" }
        ], 0);

        if (!scope && !customDir) {
          scope = await promptChoice(rl, "Install scope:", [
            { label: "Global (available in all projects)", value: "global" },
            { label: "Project only (current directory)", value: "project" }
          ], 0);
        }
      } finally {
        rl.close();
      }
    }
  }

  agent ||= "claude";
  scope ||= "global";
  validateAgent(agent);
  validateScope(scope);

  const root = customDir ? path.resolve(expandHome(customDir)) : targetRoot(agent, scope);
  return { agent, scope, root, target: path.join(root, skillName) };
}

function copySkillAtomic(source, target, dryRun) {
  const parent = path.dirname(target);
  const temp = path.join(parent, `.${skillName}.tmp-${process.pid}`);
  const backup = path.join(parent, `.${skillName}.backup-${process.pid}`);

  if (dryRun) return;

  fs.mkdirSync(parent, { recursive: true });
  fs.rmSync(temp, { recursive: true, force: true });
  fs.cpSync(source, temp, { recursive: true });

  const hadExisting = fs.existsSync(target);
  try {
    if (hadExisting) fs.renameSync(target, backup);
    fs.renameSync(temp, target);
    if (hadExisting) fs.rmSync(backup, { recursive: true, force: true });
  } catch (error) {
    fs.rmSync(temp, { recursive: true, force: true });
    if (!fs.existsSync(target) && fs.existsSync(backup)) {
      fs.renameSync(backup, target);
    }
    throw error;
  }
}

function installedVersion(target) {
  const meta = path.join(target, ".product-film-install.json");
  if (!fs.existsSync(meta)) return null;
  try {
    return JSON.parse(fs.readFileSync(meta, "utf8")).version || null;
  } catch {
    return null;
  }
}

function writeInstallMeta(target, meta, dryRun) {
  if (dryRun) return;
  fs.writeFileSync(
    path.join(target, ".product-film-install.json"),
    JSON.stringify(meta, null, 2) + "\n",
    "utf8"
  );
}

async function confirmReplace(target) {
  if (has("--force") || has("--yes") || has("-y") || !process.stdin.isTTY) return true;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(`Product Film already exists at:\n  ${target}\nReplace it? [y/N]: `);
    return /^y(es)?$/i.test(answer.trim());
  } finally {
    rl.close();
  }
}

async function installOrUpdate(mode) {
  if (!fs.existsSync(skillSource)) {
    throw new Error("Bundled product-film skill is missing from this npm package.");
  }

  const info = await resolveTarget();
  const exists = fs.existsSync(info.target);
  const dryRun = has("--dry-run");

  if (exists && mode === "install" && !(await confirmReplace(info.target))) {
    console.log("Cancelled.");
    return;
  }

  const action = exists ? "Updating" : "Installing";
  console.log(`${action} Product Film ${readPackageVersion()}\n  → ${info.target}`);

  copySkillAtomic(skillSource, info.target, dryRun);
  writeInstallMeta(info.target, {
    name: skillName,
    version: readPackageVersion(),
    agent: info.agent,
    scope: info.scope,
    installedAt: new Date().toISOString(),
    source: "npm:product-film-skill"
  }, dryRun);

  if (dryRun) {
    console.log("Dry run only — no files changed.");
    return;
  }

  console.log("\n✓ Product Film installed.");
  if (info.agent === "codex") console.log("Restart Codex if the skill is not immediately visible.");
  if (info.agent === "claude") console.log('Ask Claude Code to “use the product-film skill” or let it auto-trigger from the task.');
  if (info.agent === "opencode") console.log('OpenCode will discover the skill from its skills directory.');
  if (info.agent === "agy") console.log('Antigravity CLI will discover the skill globally; use /skills or /product-film in agy.');
}

async function status() {
  const info = await resolveTarget();
  if (!fs.existsSync(info.target)) {
    console.log(`Not installed at:\n  ${info.target}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Installed: ${info.target}`);
  console.log(`Installed version: ${installedVersion(info.target) || "unknown"}`);
  console.log(`Package version:   ${readPackageVersion()}`);
}

async function uninstall() {
  const info = await resolveTarget();
  if (!fs.existsSync(info.target)) {
    console.log(`Nothing to remove at:\n  ${info.target}`);
    return;
  }

  if (!has("--yes") && !has("-y") && process.stdin.isTTY) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    try {
      const answer = await rl.question(`Remove Product Film from:\n  ${info.target}\nContinue? [y/N]: `);
      if (!/^y(es)?$/i.test(answer.trim())) {
        console.log("Cancelled.");
        return;
      }
    } finally {
      rl.close();
    }
  }

  if (has("--dry-run")) {
    console.log(`Would remove: ${info.target}`);
    return;
  }

  fs.rmSync(info.target, { recursive: true, force: true });
  console.log(`✓ Removed ${info.target}`);
}

async function main() {
  if (has("--help") || has("-h")) {
    console.log(HELP);
    return;
  }
  if (has("--version") || has("-v")) {
    console.log(readPackageVersion());
    return;
  }

  if (!["install", "update", "status", "uninstall"].includes(command)) {
    throw new Error(`Unknown command "${command}".\n\n${HELP}`);
  }

  if (command === "install" || command === "update") await installOrUpdate(command);
  if (command === "status") await status();
  if (command === "uninstall") await uninstall();
}

main().catch((error) => {
  console.error(`\n✗ ${error.message}`);
  process.exitCode = 1;
});
