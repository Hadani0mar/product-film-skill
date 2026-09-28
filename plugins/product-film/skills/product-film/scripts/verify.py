"""Verify rendered product-film deliverables.

Examples:

Finite silent ad:
    uv run --with numpy --with imageio-ffmpeg python3 scripts/verify.py out/my-film/v1 \
        --duration 120 --fps 60 --size 1920x1080 --mode finite --audio none

Loop with audio deliverable(s):
    uv run --with numpy --with imageio-ffmpeg python3 scripts/verify.py out/landing/v3 \
        --duration 20 --fps 60 --size 1920x1080 --mode loop --audio any

Finite mode checks decode, dimensions, fps, duration, audio expectation and edge-frame
stability. Loop mode adds a strict first/last seam comparison.
"""

import argparse
import glob
import json
import os
import re
import subprocess
import sys

import imageio_ffmpeg
import numpy as np

FF = imageio_ffmpeg.get_ffmpeg_exe()


def media_info(path):
    proc = subprocess.run([FF, "-hide_banner", "-i", path], capture_output=True, text=True)
    text = proc.stderr
    duration_match = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", text)
    if not duration_match:
        raise RuntimeError(f"Could not read duration: {path}")
    h, m, s = duration_match.groups()
    duration = int(h) * 3600 + int(m) * 60 + float(s)

    video_line = next((line for line in text.splitlines() if "Video:" in line), "")
    size_match = re.search(r"(\d{2,5})x(\d{2,5})", video_line)
    fps_match = re.search(r"([0-9]+(?:\.[0-9]+)?)\s*fps", video_line)
    if not size_match:
        raise RuntimeError(f"Could not read dimensions: {path}")
    width, height = (int(v) for v in size_match.groups())
    fps = float(fps_match.group(1)) if fps_match else None
    has_audio = any("Audio:" in line for line in text.splitlines())
    return {
        "duration": duration,
        "width": width,
        "height": height,
        "fps": fps,
        "has_audio": has_audio,
    }


def frame(path, index, width, height):
    raw = subprocess.run(
        [
            FF,
            "-v",
            "error",
            "-i",
            path,
            "-vf",
            f"select=eq(n\\,{index})",
            "-frames:v",
            "1",
            "-f",
            "rawvideo",
            "-pix_fmt",
            "rgb24",
            "-",
        ],
        capture_output=True,
    ).stdout
    expected = width * height * 3
    if len(raw) != expected:
        raise RuntimeError(
            f"Frame {index} decode returned {len(raw)} bytes; expected {expected}: {path}"
        )
    return np.frombuffer(raw, np.uint8).reshape(height, width, 3).astype(int)


def delta(a, b):
    d = np.abs(a - b)
    return {
        "mean": float(d.mean()),
        "max": int(d.max()),
        "pixels_gt_3": int((d.max(axis=2) > 3).sum()),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("folder")
    parser.add_argument("--duration", type=float, required=True)
    parser.add_argument("--fps", type=float, default=60)
    parser.add_argument("--size", default="1920x1080")
    parser.add_argument("--mode", choices=["finite", "loop"], default="finite")
    parser.add_argument("--audio", choices=["none", "required", "any"], default="any")
    parser.add_argument("--bg", default=None, help="Optional expected frame-0 center RGB: 10,10,10")
    parser.add_argument("--probe", action="append", default=[])
    parser.add_argument(
        "--edge-threshold",
        type=float,
        default=45.0,
        help="Maximum mean RGB delta allowed between adjacent edge frames in finite mode.",
    )
    parser.add_argument("--json", dest="json_path", default=None)
    args = parser.parse_args()

    expected_width, expected_height = (int(v) for v in args.size.lower().split("x"))
    expected_bg = (
        np.array([int(v) for v in args.bg.split(",")]) if args.bg is not None else None
    )

    files = sorted(
        glob.glob(os.path.join(args.folder, "*.mp4"))
        + glob.glob(os.path.join(args.folder, "*.webm"))
    )
    if not files:
        print("no .mp4 or .webm files found")
        return 1

    failed = False
    results = []

    for path in files:
        name = os.path.basename(path)
        try:
            info = media_info(path)
            width, height = info["width"], info["height"]
            last = max(0, round(info["duration"] * (info["fps"] or args.fps)) - 1)

            first = frame(path, 0, width, height)
            second = frame(path, min(1, last), width, height)
            penultimate = frame(path, max(0, last - 1), width, height)
            end = frame(path, last, width, height)

            ok_duration = abs(info["duration"] - args.duration) < 1.5 / args.fps
            ok_size = width == expected_width and height == expected_height
            ok_fps = info["fps"] is not None and abs(info["fps"] - args.fps) <= 0.05

            if args.audio == "none":
                ok_audio = not info["has_audio"]
            elif args.audio == "required":
                ok_audio = info["has_audio"]
            else:
                ok_audio = True

            first_delta = delta(first, second)
            last_delta = delta(penultimate, end)
            ok_edges = (
                first_delta["mean"] <= args.edge_threshold
                and last_delta["mean"] <= args.edge_threshold
            )

            seam = delta(first, end)
            ok_seam = True
            if args.mode == "loop":
                ok_seam = (
                    seam["pixels_gt_3"] < 0.001 * width * height and seam["max"] < 24
                )

            ok_bg = True
            center = first[height // 2, width // 2]
            if expected_bg is not None:
                ok_bg = bool(np.all(np.abs(center - expected_bg) <= 2))

            ok = ok_duration and ok_size and ok_fps and ok_audio and ok_bg and ok_edges and ok_seam
            failed |= not ok

            record = {
                "file": name,
                "ok": ok,
                "duration": info["duration"],
                "duration_ok": ok_duration,
                "size": f"{width}x{height}",
                "size_ok": ok_size,
                "fps": info["fps"],
                "fps_ok": ok_fps,
                "has_audio": info["has_audio"],
                "audio_ok": ok_audio,
                "frame0_center_rgb": center.tolist(),
                "background_ok": ok_bg,
                "first_edge_delta": first_delta,
                "last_edge_delta": last_delta,
                "edge_stability_ok": ok_edges,
                "mode": args.mode,
                "seam": seam if args.mode == "loop" else None,
                "seam_ok": ok_seam,
                "probes": [],
            }

            print(
                f"{name}: "
                f"{info['duration']:.3f}s {'ok' if ok_duration else 'WRONG'} | "
                f"{width}x{height} {'ok' if ok_size else 'WRONG'} | "
                f"{info['fps']}fps {'ok' if ok_fps else 'WRONG'} | "
                f"audio={'yes' if info['has_audio'] else 'no'} {'ok' if ok_audio else 'WRONG'} | "
                f"edge mean {first_delta['mean']:.2f}/{last_delta['mean']:.2f} {'ok' if ok_edges else 'POP'}"
                + (
                    f" | seam {seam['pixels_gt_3']}px>3 max {seam['max']} {'ok' if ok_seam else 'JUMPS'}"
                    if args.mode == "loop"
                    else ""
                )
            )

            for probe in args.probe:
                when, point = probe.split(":")
                x, y = (int(v) for v in point.split(","))
                probe_frame = round(float(when) * (info["fps"] or args.fps))
                rgb = frame(path, probe_frame, width, height)[y, x].tolist()
                record["probes"].append({"probe": probe, "rgb": rgb})
                print(f"    probe {probe}: {rgb}")

            results.append(record)

        except Exception as exc:
            failed = True
            print(f"{name}: VERIFY ERROR: {exc}")
            results.append({"file": name, "ok": False, "error": str(exc)})

    summary = {
        "folder": os.path.abspath(args.folder),
        "mode": args.mode,
        "audio_expectation": args.audio,
        "expected_duration": args.duration,
        "expected_fps": args.fps,
        "expected_size": args.size,
        "ok": not failed,
        "files": results,
    }
    output = args.json_path or os.path.join(args.folder, "verify.json")
    with open(output, "w", encoding="utf-8") as handle:
        json.dump(summary, handle, indent=2)
        handle.write("\n")
    print(f"verification report: {output}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
