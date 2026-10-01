#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const BASE = "https://dblogo.com";
const ASSET_BASE = "https://assets.dblogo.com";
const argv = process.argv.slice(2);
const command = argv.shift() || "help";

function parseFlag(args, name, fallback = null) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const value = args[i + 1] ?? fallback;
  args.splice(i, 2);
  return value;
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(value) {
  return decodeHtml(String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function absolute(href) {
  if (!href) return null;
  if (/^https?:\/\//i.test(href)) return href;
  return new URL(href, BASE).toString();
}

async function getText(url) {
  const res = await fetch(url, {
    headers: {
      "user-agent": "product-film-skill/1.12 (+https://github.com/Hadani0mar/product-film-skill)",
      accept: "text/html,application/xhtml+xml"
    },
    redirect: "follow"
  });
  if (!res.ok) throw new Error("DBLogo request failed: " + res.status + " " + res.statusText + " — " + url);
  return await res.text();
}

function brandSearchUrl(query, sort = "popular") {
  const url = new URL("/search", BASE);
  url.searchParams.set("q", query);
  if (sort) url.searchParams.set("sort", sort);
  return url.toString();
}

function brandPageUrl(slug) {
  return BASE + "/logo/" + encodeURIComponent(slug);
}

function parseBrands(html) {
  const found = new Map();
  const re = /<a\b[^>]*href=["'](?:https?:\/\/dblogo\.com)?\/logo\/([a-z0-9-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = re.exec(html))) {
    const slug = match[1];
    if (slug.includes("/file/")) continue;
    const label = stripTags(match[2]);
    if (!found.has(slug)) {
      found.set(slug, {slug, name: label || slug, url: brandPageUrl(slug)});
    }
  }
  return [...found.values()];
}

function parseFiles(html, brandSlug) {
  const found = new Map();
  const re = /<a\b[^>]*href=["'](?:https?:\/\/dblogo\.com)?\/logo\/([a-z0-9-]+)\/file\/([a-z0-9-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = re.exec(html))) {
    const slug = match[1];
    if (brandSlug && slug !== brandSlug) continue;
    const fileSlug = match[2];
    const label = stripTags(match[3]);
    if (!found.has(fileSlug)) {
      const ext = fileSlug.endsWith("-svg") ? "svg" : fileSlug.endsWith("-png") ? "png" : null;
      found.set(fileSlug, {
        brandSlug: slug,
        fileSlug,
        name: label && label.toLowerCase() !== "download" ? label : fileSlug.replace(/-/g, " "),
        type: ext,
        pageUrl: BASE + "/logo/" + slug + "/file/" + fileSlug,
        assetUrl: ext ? ASSET_BASE + "/logo/" + slug + "/" + fileSlug + "." + ext : null
      });
    }
  }

  // Some pages put the human-readable heading next to a generic "Download" link.
  if (!found.size) {
    const headingRe = /<h3\b[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<a\b[^>]*href=["'](?:https?:\/\/dblogo\.com)?\/logo\/([a-z0-9-]+)\/file\/([a-z0-9-]+)["'][^>]*>/gi;
    while ((match = headingRe.exec(html))) {
      const slug = match[2];
      if (brandSlug && slug !== brandSlug) continue;
      const fileSlug = match[3];
      const ext = fileSlug.endsWith("-svg") ? "svg" : fileSlug.endsWith("-png") ? "png" : null;
      found.set(fileSlug, {
        brandSlug: slug,
        fileSlug,
        name: stripTags(match[1]) || fileSlug.replace(/-/g, " "),
        type: ext,
        pageUrl: BASE + "/logo/" + slug + "/file/" + fileSlug,
        assetUrl: ext ? ASSET_BASE + "/logo/" + slug + "/" + fileSlug + "." + ext : null
      });
    }
  }

  return [...found.values()];
}

function preferenceScore(file, terms = []) {
  const haystack = (file.name + " " + file.fileSlug).toLowerCase();
  let score = 0;
  if (file.type === "svg") score += 40;
  if (/\blogo\b/.test(haystack)) score += 16;
  if (/\bcolored\b/.test(haystack)) score += 10;
  if (/\blight\b/.test(haystack)) score += 6;
  if (/\bicon\b/.test(haystack)) score += 2;
  for (const term of terms) {
    if (haystack.includes(term)) score += 25;
  }
  return score;
}

function printFile(file, index = null) {
  const prefix = index == null ? "" : String(index).padStart(2) + ". ";
  console.log(prefix + file.name);
  console.log("    type: " + (file.type || "unknown"));
  console.log("    page: " + file.pageUrl);
  if (file.assetUrl) console.log("    asset: " + file.assetUrl);
}

async function search(query, sort, limit) {
  if (!query.trim()) throw new Error("Search query is empty.");
  const url = brandSearchUrl(query, sort);
  console.log("\nDBLogo search: " + url + "\n");
  try {
    const html = await getText(url);
    const brands = parseBrands(html).slice(0, limit);
    if (!brands.length) {
      console.log("No parsed brand matches. Open the DBLogo search URL above.");
      return;
    }
    brands.forEach((brand, i) => {
      console.log(String(i + 1).padStart(2) + ". " + brand.name);
      console.log("    slug: " + brand.slug);
      console.log("    page: " + brand.url);
    });
  } catch (error) {
    console.warn("Live search unavailable: " + error.message);
    console.log("Open the DBLogo search URL above, or try:");
    console.log("  node scripts/brand-logo-search.mjs files " + slugify(query));
  }
}

async function files(brand, matchTerms = [], limit = 20) {
  const slug = slugify(brand);
  if (!slug) throw new Error("Brand is empty.");
  const url = brandPageUrl(slug);
  const html = await getText(url);
  const variants = parseFiles(html, slug)
    .sort((a, b) => preferenceScore(b, matchTerms) - preferenceScore(a, matchTerms))
    .slice(0, limit);

  if (!variants.length) {
    console.log("No downloadable variants parsed. Open: " + url);
    return [];
  }

  console.log("\nDBLogo variants for: " + slug + "\n");
  variants.forEach((file, i) => printFile(file, i + 1));
  return variants;
}

async function download(brand, matchValue, outValue) {
  const terms = String(matchValue || "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const variants = await files(brand, terms, 50);
  if (!variants.length) throw new Error("No DBLogo variants available.");

  const selected = variants[0];
  if (!selected.assetUrl) throw new Error("Selected variant has no direct asset URL.");

  const res = await fetch(selected.assetUrl, {
    headers: {"user-agent": "product-film-skill/1.12"},
    redirect: "follow"
  });
  if (!res.ok) throw new Error("Asset download failed: " + res.status + " " + res.statusText);

  const ext = selected.type || "asset";
  const dest = path.resolve(outValue || path.join(process.cwd(), "public", "brand-logos", selected.brandSlug, selected.fileSlug + "." + ext));
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));

  console.log("\nSelected: " + selected.name);
  console.log("Saved: " + dest);
  console.log("Source: " + selected.pageUrl);
  console.log("Trademark note: follow the brand owner's official usage guidelines.");
}

function urlCommand(query, sort) {
  console.log(brandSearchUrl(query, sort));
}

function validate() {
  const sample = {
    brandSlug: "claude",
    fileSlug: "claude-logo-colored-light-svg",
    name: "Claude Logo Colored Light SVG",
    type: "svg",
    pageUrl: BASE + "/logo/claude/file/claude-logo-colored-light-svg",
    assetUrl: ASSET_BASE + "/logo/claude/claude-logo-colored-light-svg.svg"
  };
  if (!brandSearchUrl("Claude", "popular").includes("q=Claude")) throw new Error("search URL builder failed");
  if (preferenceScore(sample, ["logo"]) <= 0) throw new Error("variant scoring failed");
  if (slugify("Microsoft Copilot") !== "microsoft-copilot") throw new Error("slugify failed");
  console.log("brand logo search validation passed");
}

switch (command) {
  case "search": {
    const sort = parseFlag(argv, "--sort", "popular");
    const limit = Number(parseFlag(argv, "--limit", "10")) || 10;
    await search(argv.join(" "), sort, limit);
    break;
  }
  case "files": {
    const match = parseFlag(argv, "--match", "");
    const limit = Number(parseFlag(argv, "--limit", "20")) || 20;
    await files(argv.join(" "), String(match).toLowerCase().split(/\s+/).filter(Boolean), limit);
    break;
  }
  case "download": {
    const match = parseFlag(argv, "--match", "logo colored light svg");
    const out = parseFlag(argv, "--out", null);
    await download(argv.join(" "), match, out);
    break;
  }
  case "url": {
    const sort = parseFlag(argv, "--sort", "popular");
    urlCommand(argv.join(" "), sort);
    break;
  }
  case "validate":
    validate();
    break;
  default:
    console.log([
      "DBLogo brand logo search",
      "",
      "Commands:",
      "  search <brand/company/app> [--sort popular] [--limit 10]",
      "  files <brand-or-slug> [--match \"logo colored light svg\"] [--limit 20]",
      "  download <brand-or-slug> [--match \"icon white dark svg\"] [--out path]",
      "  url <query> [--sort popular]",
      "  validate",
      "",
      "Examples:",
      '  node scripts/brand-logo-search.mjs search "Claude" --sort popular',
      '  node scripts/brand-logo-search.mjs search "Microsoft Copilot"',
      '  node scripts/brand-logo-search.mjs files claude --match "logo colored light svg"',
      '  node scripts/brand-logo-search.mjs download openai --match "icon black light svg"',
      '  node scripts/brand-logo-search.mjs download gemini --out public/brand-logos/gemini.svg',
      "",
      "Policy: DBLogo is a discovery/download source, not a trademark license. Follow official brand guidelines."
    ].join("\n"));
}
