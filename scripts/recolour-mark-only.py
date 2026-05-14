"""Generate a mark-only (T + balance pans, no wordmark) ink variant via
Nano Banana Pro, to match the wordmark recolour."""

import base64, json, os, sys, urllib.request
from pathlib import Path

API_KEY = os.environ["GEMINI_API_KEY"]
REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "frontend" / "public" / "logo" / "mark.png"
OUT = REPO / "frontend" / "public" / "logo" / "recoloured" / "mark-ink.png"
OUT.parent.mkdir(parents=True, exist_ok=True)

src_b64 = base64.b64encode(SRC.read_bytes()).decode()
prompt = (
    "Reproduce this exact mark composition. A didone serif T with two "
    "balance pans suspended from its crossbar, each pan holding a stylised "
    "document. Render the entire mark in solid graphite ink colour #141618 "
    "on a fully transparent background. No teal. No background fill. "
    "Keep all proportions, suspension lines, and document silhouettes "
    "identical to the source."
)

url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key={API_KEY}"
payload = json.dumps({
    "contents": [{"parts": [
        {"inlineData": {"mimeType": "image/png", "data": src_b64}},
        {"text": prompt},
    ]}],
    "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
}).encode()

req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
with urllib.request.urlopen(req, timeout=300) as resp:
    data = json.loads(resp.read())

for part in data["candidates"][0]["content"]["parts"]:
    if "inlineData" in part:
        OUT.write_bytes(base64.b64decode(part["inlineData"]["data"]))
        print(f"saved {OUT} ({OUT.stat().st_size // 1024}k)")
        sys.exit(0)

sys.exit("no image returned")
