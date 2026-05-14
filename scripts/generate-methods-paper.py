"""Generate a single-page placeholder methods paper PDF as a real artefact
that can be downloaded from the hero CTA. Uses reportlab's stdlib-only
canvas; if reportlab isn't installed, fall back to a hand-written PDF
with PyPDF / fpdf2.

Output: frontend/public/methods-paper.pdf
"""
import subprocess, sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "frontend" / "public" / "methods-paper.pdf"

# Try reportlab first.
try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm
    from reportlab.pdfgen import canvas
    from reportlab.lib import colors
except ImportError:
    print("reportlab not installed; installing...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--quiet", "reportlab"])
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm
    from reportlab.pdfgen import canvas
    from reportlab.lib import colors

INK = colors.HexColor("#141618")
INK_60 = colors.HexColor("#535659")
INK_40 = colors.HexColor("#878A8C")
INK_25 = colors.HexColor("#B0B3B4")
PAPER = colors.HexColor("#FBFAF6")
RISK_CRIT = colors.HexColor("#8E1B17")
RULE = colors.HexColor("#C9CBCC")

c = canvas.Canvas(str(OUT), pagesize=A4)
c.setTitle("Trutina methods paper")
c.setAuthor("Trutina")
c.setSubject("Forensic mortgage fraud detection: methods and rules")

W, H = A4

# --- Background paper ---
c.setFillColor(PAPER)
c.rect(0, 0, W, H, stroke=0, fill=1)

# --- Margin rule (left, line-numbered margin) ---
c.setStrokeColor(INK_25)
c.setLineWidth(0.4)
c.line(28 * mm, 24 * mm, 28 * mm, H - 24 * mm)
c.setFont("Helvetica", 6)
c.setFillColor(INK_40)
for i in range(1, 19):
    y = H - 28 * mm - i * 13 * mm
    if y < 30 * mm:
        break
    c.drawRightString(26 * mm, y, str(i * 5))

# --- Header ---
c.setFillColor(INK_40)
c.setFont("Helvetica", 7)
c.drawString(34 * mm, H - 18 * mm, "TRUTINA . METHODS PAPER . V2026.04 . DRAFT")
c.drawRightString(W - 18 * mm, H - 18 * mm, "Prepared 2026-05-14 . trutina.com.au")
c.setStrokeColor(INK_25)
c.line(28 * mm, H - 22 * mm, W - 18 * mm, H - 22 * mm)

# --- Section label ---
c.setFillColor(INK_60)
c.setFont("Helvetica-Bold", 7)
c.drawString(34 * mm, H - 32 * mm, "METHODS PAPER")

# --- Title ---
c.setFillColor(INK)
c.setFont("Times-Roman", 28)
c.drawString(34 * mm, H - 46 * mm, "Forensic mortgage fraud detection")
c.setFont("Times-Roman", 18)
c.drawString(34 * mm, H - 56 * mm, "Methods, rules, and evidence ledger.")

# --- Subhead ---
c.setFillColor(INK_60)
c.setFont("Helvetica", 9.5)
c.drawString(34 * mm, H - 66 * mm, "Five detection modules, forty-six rules, citation per flag. APRA CPG 234 aligned.")

# --- Body sections ---
y = H - 80 * mm

def section(label, body_lines, indent=34):
    global y
    c.setFillColor(INK_60); c.setFont("Helvetica-Bold", 8)
    c.drawString(indent * mm, y, label.upper())
    y -= 5 * mm
    c.setFillColor(INK); c.setFont("Times-Roman", 9.5)
    for line in body_lines:
        c.drawString(indent * mm, y, line)
        y -= 4 * mm
    y -= 3 * mm

section("01 . What this paper is", [
    "A working draft of the Trutina methods. The detection engine measures four properties of every",
    "payslip, employer letter, and bank statement in a loan application. This paper names the rules,",
    "states their tests, and documents the evidence ledger that retains the result for seven years.",
])

section("02 . The five detection modules", [
    "PM . Producer metadata.  14 rules. Detects PDF producer / font-subset / object-stream mismatches.",
    "IC . Identity coherence.  9 rules.  Checks that fields agree across files (name, BSB, ABN, address).",
    "IA . Income arithmetic.   11 rules. Verifies gross - PAYG = net and super at SG rate against base.",
    "EV . Employer verification. 7 rules. Tests asserted ABN against ABR live + ASIC headcount band.",
    "NC . Network clustering.  5 rules.  Detects shared producer signatures across a broker's last 60 days.",
])

section("03 . Evidence ledger", [
    "Every flag fired records: rule id, source filename, SHA-256, page, byte offset, fired-at timestamp,",
    "evaluation duration, and severity. Retained 7 years per APRA CPG 234 retention requirements.",
    "Ledger entries are immutable. The lender's system of record holds the source PDFs; Trutina retains",
    "evidence pointers, not the source documents themselves.",
])

section("04 . What this paper does not yet contain", [
    "Calibration metrics (measured fraud rate, false-positive rate, time-to-verdict, reviewer time saved).",
    "Those numbers will be published quarterly once the customer cohort supports independent measurement.",
    "Until then, the methodology stands on the named rules above and their published test definitions.",
])

# --- Footer ---
c.setStrokeColor(INK_25)
c.line(28 * mm, 24 * mm, W - 18 * mm, 24 * mm)
c.setFillColor(INK_40); c.setFont("Helvetica", 7)
c.drawString(34 * mm, 18 * mm, "trutina.com.au . hello@trutina.com.au")
c.drawRightString(W - 18 * mm, 18 * mm, "Draft v2026.04 . single page . full paper available on request")

# --- Watermark: DRAFT ---
c.saveState()
c.translate(W / 2, H / 2)
c.rotate(-30)
c.setFillColor(colors.HexColor("#E8EAE5"))
c.setFont("Helvetica-Bold", 120)
c.drawCentredString(0, -20, "DRAFT")
c.restoreState()

c.showPage()
c.save()

print(f"saved {OUT} ({OUT.stat().st_size} bytes)")
