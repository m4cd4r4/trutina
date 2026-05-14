"""Nano Banana Pro returned RGB images with the checkerboard baked as
solid grey. Convert each recoloured logo to RGBA with the grey backdrop
keyed out to transparency.

Strategy: any pixel that is light grey (R, G, B all > 200 and within 20
of each other) becomes alpha=0. Pixels with strong colour or dark
luminance stay opaque. Mid-grey edges (anti-aliased letter outlines) get
proportional alpha so the kerning doesn't get jaggies.
"""

from PIL import Image
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SRC_DIR = REPO / "frontend" / "public" / "logo" / "recoloured"

def transparentise(src_path: Path):
    img = Image.open(src_path).convert("RGBA")
    px = img.load()
    w, h = img.size
    changed = 0
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            # background: nearly-neutral grey (R~=G~=B), light to mid-light.
            # The Nano Banana checkerboard has dark squares at ~(196,196,196)
            # and light squares at ~(255,255,255). Both get keyed.
            spread = max(r, g, b) - min(r, g, b)
            avg = (r + g + b) / 3
            if avg > 160 and spread < 30:
                # Hard cut: anything brighter than mid-light grey snaps
                # straight to alpha 0. Only the narrow band 140-160 gets
                # proportional alpha for anti-aliased edge softening.
                if avg >= 180:
                    new_alpha = 0
                else:
                    # avg 160 -> 255 alpha (kept), avg 180 -> 0 alpha.
                    new_alpha = int(255 * (180 - avg) / 20)
                px[x, y] = (r, g, b, new_alpha)
                if new_alpha < 255:
                    changed += 1
    out = src_path  # overwrite in place
    img.save(out, "PNG")
    print(f"  {src_path.name}: {changed} px keyed to alpha, mode={img.mode}")

for p in sorted(SRC_DIR.glob("*.png")):
    transparentise(p)
print("done")
