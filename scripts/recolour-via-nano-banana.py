"""Recolour the Trutina logo through Nano Banana Pro (Gemini 3 Pro Image Preview).

Sends frontend/public/logo/combo.png as the reference and requests five
recoloured variants on a transparent background. Saves outputs to
frontend/public/logo/recoloured/.

Per the generate-media skill routing table, Nano Banana Pro is the right
tool here because the "Trutina" wordmark must remain legible.
"""

import base64
import json
import os
import sys
import time
import urllib.request
from pathlib import Path

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    sys.exit("GEMINI_API_KEY not set")

REPO_ROOT = Path(__file__).resolve().parent.parent
SRC = REPO_ROOT / "frontend" / "public" / "logo" / "combo.png"
OUT_DIR = REPO_ROOT / "frontend" / "public" / "logo" / "recoloured"
OUT_DIR.mkdir(parents=True, exist_ok=True)

if not SRC.exists():
    sys.exit(f"source missing: {SRC}")

src_b64 = base64.b64encode(SRC.read_bytes()).decode()

# Five variants. Each prompt instructs the model to reproduce the exact
# composition of the source image in the named colour, with a transparent
# background.
VARIANTS = [
    ("ink", "#141618",
     "Reproduce this exact logo composition. Same didone T with two balance pans suspended from its crossbar, each pan holding a stylised document. Same thin vertical divider. Same serif Trutina wordmark with the fade treatment on the last four letters. Render the entire logo in solid graphite ink colour #141618 on a fully transparent background. No teal anywhere. No background fill. Keep all proportions, spacing, and serifs identical to the source."),
    ("accent", "#1F4FA3",
     "Reproduce this exact logo composition. Same didone T with two balance pans suspended from its crossbar. Same divider. Same serif Trutina wordmark. Render the entire logo in solid notary blue #1F4FA3 on a fully transparent background. No teal. No background fill. Identical proportions and serifs."),
    ("oxblood", "#8E1B17",
     "Reproduce this exact logo composition. Same didone T, balance pans, divider, and serif Trutina wordmark. Render in solid stamp-oxblood #8E1B17 on a fully transparent background. No teal. No background fill. Identical proportions and serifs."),
    ("moss", "#4F6A4A",
     "Reproduce this exact logo composition. Same didone T, balance pans, divider, and serif Trutina wordmark. Render in solid ledger-moss green #4F6A4A on a fully transparent background. No teal. No background fill. Identical proportions and serifs."),
    ("two-tone", "graphite + accent",
     "Reproduce this exact logo composition. Same didone T, balance pans, divider, and serif Trutina wordmark. Render the T mark, balance pans, and vertical divider in graphite ink #141618. Render the Trutina wordmark text in notary blue #1F4FA3. Fully transparent background. No teal. No background fill. Identical proportions and serifs."),
]

URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key={API_KEY}"


def generate(name: str, colour: str, prompt: str) -> Path | None:
    payload = json.dumps({
        "contents": [{
            "parts": [
                {"inlineData": {"mimeType": "image/png", "data": src_b64}},
                {"text": prompt},
            ]
        }],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
    }).encode()
    req = urllib.request.Request(URL, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=300) as resp:
            data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"  [{name}] HTTP {e.code}: {e.read().decode()[:400]}")
        return None
    except Exception as e:
        print(f"  [{name}] error: {e}")
        return None

    parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    for part in parts:
        if "inlineData" in part:
            out = OUT_DIR / f"logo-{name}.png"
            out.write_bytes(base64.b64decode(part["inlineData"]["data"]))
            kb = out.stat().st_size // 1024
            print(f"  [{name}] saved {out.name} ({kb}k)")
            return out

    text = next((p.get("text", "") for p in parts if "text" in p), "")
    print(f"  [{name}] no image returned. response: {text[:200]}")
    return None


print(f"source: {SRC}")
print(f"output: {OUT_DIR}")
for name, colour, prompt in VARIANTS:
    print(f"\ngenerating {name} ({colour}) ...")
    generate(name, colour, prompt)
    time.sleep(1)

print("\ndone. files:")
for p in sorted(OUT_DIR.glob("*.png")):
    print(f"  {p.relative_to(REPO_ROOT)}")
