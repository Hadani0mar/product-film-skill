import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";

type Scene = {id:string; start:number; end:number};
type SceneMap = {composition?:string; fps?:number; duration?:number; props?:Record<string,unknown>; scenes:Scene[]};

const args = process.argv.slice(2);
function take(flag:string, fallback?:string) {
  const index = args.indexOf(flag);
  if (index === -1) return fallback;
  const result = args[index + 1];
  args.splice(index, 2);
  return result;
}

const mapPath = take("--map");
const outArg = take("--out", "out/review/smoke");
const compositionArg = take("--composition");
const propsArg = take("--props");
const debug = args.includes("--debug");
if (!mapPath) throw new Error("Usage: node --import tsx scripts/smoke-stills.ts --map <scene-map.json> [--out dir] [--composition Id] [--debug]");

const root = path.resolve(import.meta.dirname, "..");
const sceneMap = JSON.parse(fs.readFileSync(path.resolve(mapPath), "utf8")) as SceneMap;
const composition = compositionArg || sceneMap.composition;
if (!composition) throw new Error("Scene map needs composition or pass --composition.");
if (!Array.isArray(sceneMap.scenes) || sceneMap.scenes.length === 0) throw new Error("Scene map has no scenes.");

const fps = Number(sceneMap.fps || 60);
const out = path.resolve(outArg || "out/review/smoke");
const framesDir = path.join(out, "frames");
fs.mkdirSync(framesDir, {recursive:true});

const extraProps = propsArg ? JSON.parse(propsArg) : (sceneMap.props || {});
const inputProps = {fps, ...extraProps, debug};
const webpackOverride = await import(path.join(root, "webpack-override.ts")).then((m) => m.webpackOverride).catch(() => undefined);
console.log("Bundling once...");
const serveUrl = await bundle({entryPoint:path.join(root, "src/index.ts"), webpackOverride, publicDir:path.join(root, "public")});
const selected = await selectComposition({serveUrl, id:composition, inputProps});
const lastFrame = selected.durationInFrames - 1;

const wanted = new Map<number,string[]>();
function add(frame:number, label:string) {
  const f = Math.max(0, Math.min(lastFrame, Math.round(frame)));
  wanted.set(f, [...(wanted.get(f) || []), label]);
}

for (const scene of sceneMap.scenes) {
  const first = scene.start * fps;
  const last = Math.max(first, scene.end * fps - 1);
  const middle = (first + last) / 2;
  add(first, scene.id + ":first");
  add(middle, scene.id + ":middle");
  add(last, scene.id + ":last");
}
for (const scene of sceneMap.scenes.slice(1)) {
  const boundary = scene.start * fps;
  for (const offset of [-2,-1,0,1,2]) add(boundary + offset, scene.id + ":boundary" + (offset >= 0 ? "+" : "") + String(offset));
}

const ordered = [...wanted.entries()].sort((a,b) => a[0] - b[0]);
const manifest = [];
for (let index = 0; index < ordered.length; index++) {
  const frame = ordered[index][0];
  const labels = ordered[index][1];
  const filename = String(index).padStart(3, "0") + ".png";
  const output = path.join(framesDir, filename);
  await renderStill({serveUrl, composition:selected, inputProps, frame, output, overwrite:true});
  manifest.push({index, frame, seconds:frame / fps, labels, file:path.relative(out, output)});
  console.log(filename + " frame=" + String(frame) + " " + labels.join(", "));
}
fs.writeFileSync(path.join(out, "smoke-manifest.json"), JSON.stringify({composition,fps,frames:manifest}, null, 2) + "\n");

const ff = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
const ffCheck = spawnSync(ff, ["-version"], {encoding:"utf8"});
if (ffCheck.status === 0 && manifest.length) {
  const cols = Math.min(4, manifest.length);
  const rows = Math.ceil(manifest.length / cols);
  const result = spawnSync(ff, [
    "-v","error","-y","-framerate","1","-i",path.join(framesDir,"%03d.png"),
    "-vf","scale=480:-1,tile=" + String(cols) + "x" + String(rows) + ":padding=4:margin=4:color=0x222222",
    "-frames:v","1",path.join(out,"contact-sheet.png")
  ], {stdio:"inherit"});
  if (result.status === 0) console.log("Contact sheet: " + path.join(out, "contact-sheet.png"));
} else {
  console.warn("ffmpeg not found; stills + manifest created, no contact sheet.");
}
