# Сборка роликов кейсов из покадровой съёмки (scripts/cap-site.mjs):
# research/frames/<id>-dv|mv/*.jpg → public/cases/<id>/v-d.mp4, v-m.mp4 (+ постер v-d.jpg, v-m.jpg)
# Запуск: python -I scripts/encode-video.py <путь к ffmpeg.exe>
import subprocess
import sys
from pathlib import Path

FF = sys.argv[1]
ROOT = Path(__file__).resolve().parent.parent
SIZE = {"dv": ("d", "scale=1440:-2:flags=lanczos", "24"), "mv": ("m", "scale=520:-2:flags=lanczos", "23")}

for d in sorted((ROOT / "research" / "frames").iterdir()):
    if not d.is_dir():
        continue
    cid, mode = d.name.rsplit("-", 1)
    kind, vf, crf = SIZE[mode]
    out = ROOT / "public" / "cases" / cid
    out.mkdir(parents=True, exist_ok=True)
    mp4 = out / f"v-{kind}.mp4"
    subprocess.run([FF, "-v", "error", "-y", "-framerate", "30", "-i", str(d / "%04d.jpg"), "-vf", vf, "-an",
                    "-c:v", "libx264", "-preset", "slow", "-crf", crf, "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(mp4)], check=True)
    subprocess.run([FF, "-v", "error", "-y", "-i", str(d / "0000.jpg"), "-vf", vf, "-q:v", "3", str(out / f"v-{kind}.jpg")], check=True)
    print(cid, kind, mp4.stat().st_size // 1024, "KB")
