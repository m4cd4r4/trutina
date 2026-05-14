"""Replace the bespoke <nav> block in each /docs/{route}/page.tsx
with the canonical SiteHeader, and add SiteFooter at the closing
of each docs page.

Skips /docs/pitch (slide-deck, has its own UI).
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGETS = [
    'app/docs/compliance/page.tsx',
    'app/docs/integration/page.tsx',
    'app/docs/one-pager/page.tsx',
    'app/docs/quickstart/page.tsx',
    'app/docs/risk-scores/page.tsx',
    'app/docs/roi/page.tsx',
    'app/docs/security/page.tsx',
]

NAV_PATTERN = re.compile(
    r'<nav className="border-b border-white/5[^"]*">.*?</nav>',
    re.DOTALL,
)

def ensure_imports(src: str) -> str:
    # Add SiteHeader + SiteFooter imports (idempotent).
    if 'SiteHeader' in src and 'SiteFooter' in src:
        return src
    # Find any import line to anchor near.
    lines = src.splitlines(keepends=True)
    last_import = 0
    for i, ln in enumerate(lines):
        if ln.startswith('import ') or ln.startswith("import\t"):
            last_import = i
    inject = ''
    if 'SiteHeader' not in src:
        inject += "import SiteHeader from '@/components/design/SiteHeader'\n"
    if 'SiteFooter' not in src:
        inject += "import SiteFooter from '@/components/design/SiteFooter'\n"
    lines.insert(last_import + 1, inject)
    return ''.join(lines)


def remove_unused_logo_import(src: str) -> str:
    # If <Logo/> is no longer referenced in JSX (only via the bespoke nav
    # we just removed), drop the import to keep tsc clean.
    has_jsx_logo = bool(re.search(r'<Logo\b', src))
    if has_jsx_logo:
        return src
    # Strip the line that imports Logo.
    return re.sub(r"^import \{ ?Logo ?\} from '@/components/Logo'\n", '', src, flags=re.MULTILINE)


def replace_nav(src: str) -> str:
    return NAV_PATTERN.sub('<SiteHeader active="docs" />', src)


def add_footer_before_closing(src: str) -> str:
    # Insert <SiteFooter /> right before the FINAL closing </div> that
    # closes the page wrapper. This is the last </div> in the JSX tree
    # before the export's closing brace.
    # Heuristic: find the last "    </div>" sitting on its own line
    # near the end of the file.
    if '<SiteFooter' in src:
        return src
    lines = src.splitlines(keepends=True)
    # Walk backwards looking for the last </div>
    for i in range(len(lines) - 1, -1, -1):
        if lines[i].strip() == '</div>':
            lines.insert(i, '      <SiteFooter />\n')
            return ''.join(lines)
    return src


for tgt in TARGETS:
    path = ROOT / tgt
    src = path.read_text(encoding='utf-8')
    new = src
    new = replace_nav(new)
    new = ensure_imports(new)
    new = remove_unused_logo_import(new)
    new = add_footer_before_closing(new)
    if new != src:
        path.write_text(new, encoding='utf-8')
        print(f'updated {tgt}')
    else:
        print(f'unchanged {tgt}')
