import {spawn, spawnSync} from "node:child_process";
import fs from "node:fs";
import {join, resolve} from "node:path";

type DeliveryMode = "finite" | "loop";
type RenderProfile = "preview" | "production";
type FileConfig = {
  composition?:string; name?:string; duration?:number; mode?:DeliveryMode; silent?:boolean;
  profile?:RenderProfile; fps?:number; scale?:number; motionBlurSamples?:number;
  masterFps?:number; poster?:number; concurrency?:number;
};

const args = process.argv.slice(2);
function take(name:string, fallback?:string) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  const result = args[index + 1];
  args.splice(index, 2);
  return result;
}
function has(name:string) {
  const index = args.indexOf(name);
  if (index === -1) return false;
  args.splice(index, 1);
  return true;
}
function number(value:unknown, fallback:number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
function slug(value:string) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();
}

const configPath = take("--config");
const config:FileConfig = configPath ? JSON.parse(fs.readFileSync(resolve(configPath), "utf8")) : {};
const positionalComposition = args[0] && !args[0].startsWith("--") ? args.shift() : undefined;
const positionalName = args[0] && !args[0].startsWith("--") ? args.shift() : undefined;
const composition = take("--composition", positionalComposition || config.composition);
if (!composition) throw new Error("Missing composition. Pass <CompositionId>, --composition, or --config.");
const name = take("--name", positionalName || config.name || slug(composition));
const duration = number(take("--duration", config.duration == null ? undefined : String(config.duration)), 0);
if (!duration) throw new Error("Missing --duration (seconds), or provide duration in --config.");

const profile = (take("--profile", config.profile || "production") || "production") as RenderProfile;
const loopFlag = has("--loop");
const finiteFlag = has("--finite");
const mode = (loopFlag ? "loop" : finiteFlag ? "finite" : (take("--mode", config.mode || "finite") || "finite")) as DeliveryMode;
if (!["finite","loop"].includes(mode)) throw new Error("mode must be finite or loop");
const silent = has("--silent") ? true : has("--with-audio") ? false : (config.silent ?? true);
const fps = number(take("--fps", config.fps == null ? undefined : String(config.fps)), profile === "preview" ? 15 : 60);
const scale = number(take("--scale", config.scale == null ? undefined : String(config.scale)), profile === "preview" ? 0.25 : 1);
const samples = Math.max(1, Math.round(number(take("--motion-blur-samples", config.motionBlurSamples == null ? undefined : String(config.motionBlurSamples)), 1)));
const masterFps = number(take("--master-fps", config.masterFps == null ? undefined : String(config.masterFps)), fps * samples);
const posterSeconds = number(take("--poster", config.poster == null ? undefined : String(config.poster)), Math.max(0.01, duration * 0.8));
const concurrency = Math.max(1, Math.round(number(take("--concurrency", config.concurrency == null ? undefined : String(config.concurrency)), profile === "preview" ? 4 : 8)));
const keepIntermediates = has("--keep-intermediates");
const requestedVersion = take("--version");
if (samples > 1 && Math.abs(masterFps - fps * samples) > 0.01) throw new Error("For motion blur, master fps must equal output fps × motion-blur-samples.");

const root = resolve(import.meta.dirname, "..");
const outputRoot = join(root, "out", name || slug(composition));
fs.mkdirSync(outputRoot, {recursive:true});
function nextVersion() {
  if (requestedVersion) return requestedVersion;
  const existing = fs.readdirSync(outputRoot, {withFileTypes:true}).filter((e) => e.isDirectory()).map((e) => /^v(\d+)$/.exec(e.name)).filter(Boolean).map((m) => Number(m[1]));
  return "v" + String((existing.length ? Math.max(...existing) : 0) + 1);
}
const version = nextVersion();
const out = join(outputRoot, version);
fs.mkdirSync(out, {recursive:true});
const progressPath = join(out, "progress.json");
const manifestPath = join(out, "render-manifest.json");

const manifest:any = {
  schemaVersion:1, status:"running", startedAt:new Date().toISOString(), composition, name, version,
  config:{duration, mode, silent, profile, fps, scale, motionBlurSamples:samples, masterFps, posterSeconds, concurrency},
  outputs:[], phases:[],
};
function writeManifest() { fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n"); }
function writeProgress(data:any) { fs.writeFileSync(progressPath, JSON.stringify({...data, updatedAt:new Date().toISOString()}, null, 2) + "\n"); }
writeManifest();

function commandExists(command:string) {
  const candidate = process.platform === "win32" && !command.endsWith(".exe") ? command + ".exe" : command;
  const result = spawnSync(candidate, ["-version"], {encoding:"utf8"});
  return result.status === 0 ? candidate : undefined;
}
function resolveFfmpeg() {
  const direct = commandExists("ffmpeg");
  if (direct) return direct;
  const uv = process.platform === "win32" ? "uv.exe" : "uv";
  const found = spawnSync(uv, ["run","--quiet","--with","imageio-ffmpeg","python3","-c","import imageio_ffmpeg as i; print(i.get_ffmpeg_exe())"], {encoding:"utf8"});
  if (found.status === 0 && found.stdout.trim()) return found.stdout.trim();
  throw new Error("ffmpeg not found. Install ffmpeg or uv + imageio-ffmpeg.");
}

async function runTracked(command:string, commandArgs:string[], phase:string, expectedFrames?:number) {
  const started = Date.now();
  manifest.phases.push({phase, status:"running", startedAt:new Date().toISOString()});
  writeManifest();
  writeProgress({phase, status:"running", frame:0, totalFrames:expectedFrames || null, percent:0, elapsedSeconds:0, etaSeconds:null});
  console.log("\n== " + phase + " ==");
  console.log(command + " " + commandArgs.join(" "));

  await new Promise<void>((resolvePromise, rejectPromise) => {
    const child = spawn(command, commandArgs, {cwd:root, env:process.env, stdio:["ignore","pipe","pipe"]});
    let tail = "";
    const onChunk = (chunk:Buffer, target:NodeJS.WriteStream) => {
      target.write(chunk);
      const text = tail + chunk.toString();
      tail = text.slice(-500);
      const matches = [...text.matchAll(/(?:Rendered\s+)?(\d+)\s*(?:of|\/)\s*(\d+)/gi)];
      const last = matches[matches.length - 1];
      if (last) {
        const frame = Number(last[1]);
        const total = Number(last[2]);
        if (total > 0) {
          const elapsedSeconds = (Date.now() - started) / 1000;
          const percent = Math.min(100, frame / total * 100);
          const etaSeconds = frame > 0 ? Math.max(0, elapsedSeconds * (total - frame) / frame) : null;
          writeProgress({phase,status:"running",frame,totalFrames:total,percent:Number(percent.toFixed(2)),elapsedSeconds:Number(elapsedSeconds.toFixed(1)),etaSeconds:etaSeconds == null ? null : Number(etaSeconds.toFixed(1))});
        }
      }
    };
    child.stdout.on("data", (chunk) => onChunk(chunk, process.stdout));
    child.stderr.on("data", (chunk) => onChunk(chunk, process.stderr));
    child.on("error", rejectPromise);
    child.on("close", (code) => code === 0 ? resolvePromise() : rejectPromise(new Error(phase + " failed with exit code " + String(code))));
  });
  const elapsedSeconds = (Date.now() - started) / 1000;
  const phaseEntry = manifest.phases.findLast((p:any) => p.phase === phase);
  if (phaseEntry) Object.assign(phaseEntry, {status:"complete", endedAt:new Date().toISOString(), elapsedSeconds:Number(elapsedSeconds.toFixed(1))});
  writeProgress({phase,status:"complete",percent:100,elapsedSeconds:Number(elapsedSeconds.toFixed(1)),etaSeconds:0});
  writeManifest();
}

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const entry = "src/index.ts";
const props = (value:number) => JSON.stringify({fps:value});
const totalFrames = Math.round(duration * fps);
const h264 = ["-c:v","libx264","-preset","slow","-crf","20","-pix_fmt","yuv420p","-x264-params","colorprim=bt709:transfer=bt709:colormatrix=bt709","-color_primaries","bt709","-color_trc","bt709","-colorspace","bt709","-color_range","tv","-movflags","+faststart"];
let success = false;
const intermediates:string[] = [];

try {
  if (profile === "preview") {
    const preview = join(out, (name || slug(composition)) + "-preview.mp4");
    const renderArgs = ["remotion","render",entry,composition,preview,"--props",props(fps),"--codec","h264","--crf","26","--scale",String(scale),"--concurrency",String(concurrency),"--log","verbose"];
    if (silent) renderArgs.push("--muted");
    await runTracked(npx, renderArgs, "fast-preview", totalFrames);
    manifest.outputs.push({kind:"preview", path:preview, audio:!silent});
    manifest.status = "complete";
    manifest.endedAt = new Date().toISOString();
    writeManifest();
    console.log("\nPreview: " + preview);
    success = true;
  } else {
    const ffmpeg = resolveFfmpeg();
    const master = join(out, "master-" + String(masterFps) + ".mp4");
    intermediates.push(master);
    await runTracked(npx, ["remotion","render",entry,composition,master,"--props",props(masterFps),"--codec","h264","--crf","8","--pixel-format","yuv444p","--image-format","png","--muted","--scale",String(scale),"--concurrency",String(concurrency),"--log","verbose"], "master-render", Math.round(duration * masterFps));

    let videoSource = master;
    let sourceIsBt709 = false;
    if (samples > 1) {
      const blurred = join(out, "motion-blur-" + String(fps) + ".mov");
      intermediates.push(blurred);
      const mixFilter = "tmix=frames=" + String(samples) + ":weights='" + new Array(samples).fill("1").join(" ") + "',select='not(mod(n+1\\," + String(samples) + "))',setpts=N/(" + String(fps) + "*TB),scale=in_range=tv:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv444p10le";
      await runTracked(ffmpeg, ["-v","warning","-y","-i",master,"-vf",mixFilter,"-r",String(fps),"-c:v","prores_ks","-profile:v","4444","-color_primaries","bt709","-color_trc","bt709","-colorspace","bt709","-color_range","tv",blurred], "motion-blur");
      videoSource = blurred;
      sourceIsBt709 = true;
    }

    const mutedName = silent ? (name || slug(composition)) + ".mp4" : (name || slug(composition)) + "-muted.mp4";
    const muted = join(out, mutedName);
    const videoFilter = sourceIsBt709 ? [] : ["-vf","scale=in_range=tv:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709"];
    await runTracked(ffmpeg, ["-v","warning","-y","-i",videoSource,...videoFilter,...h264,"-r",String(fps),"-an",muted], "encode-h264");
    manifest.outputs.push({kind:silent ? "final" : "muted", path:muted, audio:false});

    let finalPath = muted;
    if (!silent) {
      const audio = join(out, "audio.wav");
      intermediates.push(audio);
      await runTracked(npx, ["remotion","render",entry,composition,audio,"--props",props(fps),"--codec","wav","--log","verbose"], "audio-render", totalFrames);
      finalPath = join(out, (name || slug(composition)) + ".mp4");
      await runTracked(ffmpeg, ["-v","warning","-y","-i",muted,"-i",audio,"-c:v","copy","-c:a","aac","-b:a","256k","-shortest",finalPath], "mux-audio");
      manifest.outputs.push({kind:"final", path:finalPath, audio:true});
    }

    const poster = join(out, "poster.jpg");
    await runTracked(ffmpeg, ["-v","warning","-y","-ss",String(posterSeconds),"-i",muted,"-frames:v","1","-q:v","2",poster], "poster");
    manifest.outputs.push({kind:"poster", path:poster});

    if (mode === "loop") {
      const webm = join(out, (name || slug(composition)) + ".webm");
      await runTracked(ffmpeg, ["-v","warning","-y","-i",muted,"-c:v","libvpx-vp9","-b:v","0","-crf","32","-row-mt","1","-pix_fmt","yuv420p","-an",webm], "encode-webm");
      manifest.outputs.push({kind:"webm-loop", path:webm, audio:false});
      const seam = join(out, "loop-seam.png");
      await runTracked(ffmpeg, ["-v","warning","-y","-stream_loop","1","-i",muted,"-vf","select='between(n\\," + String(Math.max(0,totalFrames - 8)) + "\\," + String(totalFrames + 7) + ")',scale=320:180,tile=8x2","-frames:v","1","-vsync","vfr",seam], "loop-seam-sheet");
      manifest.outputs.push({kind:"loop-seam", path:seam});
    }

    manifest.status = "complete";
    manifest.endedAt = new Date().toISOString();
    writeManifest();
    success = true;
    console.log("\nFinal: " + finalPath);
  }
} catch (error) {
  manifest.status = "failed";
  manifest.endedAt = new Date().toISOString();
  manifest.error = error instanceof Error ? error.message : String(error);
  writeManifest();
  writeProgress({phase:"failed",status:"failed",error:manifest.error});
  console.error("\nRender failed. Intermediates and diagnostics were preserved in " + out);
  throw error;
} finally {
  if (success && !keepIntermediates) {
    for (const file of intermediates) {
      try { if (fs.existsSync(file)) fs.rmSync(file); } catch {}
    }
  }
}

if (success) {
  console.log("Manifest: " + manifestPath);
  console.log("Progress: " + progressPath);
  for (const output of manifest.outputs) {
    if (output.path && fs.existsSync(output.path)) output.sizeMB = Number((fs.statSync(output.path).size / 1e6).toFixed(1));
  }
  writeManifest();
}
