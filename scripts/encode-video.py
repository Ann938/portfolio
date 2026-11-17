# Сжатие записей сайтов для кейсов: research/video/<id>-d|m.webm → public/cases/<id>/v-d.mp4, v-m.mp4 + постер
# Отрезаем загрузку в начале и ускоряем запись до нужной длины (колесо в записи медленнее реального скролла).
# Запуск: python -I scripts/encode-video.py <путь к ffmpeg.exe>
import re
import subprocess
import sys
from pathlib import Path

FF = sys.argv[1]
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "research" / "video"
SKIP = {"d": 4.0, "m": 4.0}  # секунды загрузки страницы в начале записи
TARGET = {"d": 15.0, "m": 11.0}  # длина готового ролика


def duration(f: Path) -> float:
    out = subprocess.run([FF, "-i", str(f)], capture_output=True, text=True, errors="ignore").stderr
    h, m, s = re.search(r"Duration: (\d+):(\d+):([\d.]+)", out).groups()
    return int(h) * 3600 + int(m) * 60 + float(s)


for f in sorted(SRC.glob("*.webm")):
    cid, kind = f.stem.rsplit("-", 1)
    out = ROOT / "public" / "cases" / cid
    out.mkdir(parents=True, exist_ok=True)
    d = duration(f) - SKIP[kind] - 0.6
    speed = max(1.0, d / TARGET[kind])
    scale = "scale=1280:-2" if kind == "d" else "scale=390:-2"
    vf = f"setpts=PTS/{speed:.3f},fps=30,{scale}"
    mp4 = out / f"v-{kind}.mp4"
    subprocess.run([FF, "-v", "error", "-y", "-ss", str(SKIP[kind]), "-i", str(f), "-t", str(d), "-vf", vf, "-an",
                    "-c:v", "libx264", "-preset", "slow", "-crf", "27" if kind == "d" else "26", "-pix_fmt", "yuv420p",
                    "-movflags", "+faststart", str(mp4)], check=True)
    subprocess.run([FF, "-v", "error", "-y", "-i", str(mp4), "-frames:v", "1", "-q:v", "4", str(out / f"v-{kind}.jpg")], check=True)
    print(cid, kind, f"скорость x{speed:.1f}", f"{mp4.stat().st_size // 1024} КБ")
