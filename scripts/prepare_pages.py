"""Build repository-relative, versioned Pages files without changing the entry URL."""
from pathlib import Path
import hashlib
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / '_site'
inputs = [ROOT / 'index.html'] + sorted(p for folder in ('css', 'js', 'assets') for p in (ROOT / folder).rglob('*') if p.is_file() and not p.name.startswith('.'))
digest = hashlib.sha256()
for source in inputs:
    digest.update(source.relative_to(ROOT).as_posix().encode())
    digest.update(source.read_bytes())
version = digest.hexdigest()[:16]
if OUTPUT.exists():
    shutil.rmtree(OUTPUT)
for source in inputs:
    target = OUTPUT / source.relative_to(ROOT)
    target.parent.mkdir(parents=True, exist_ok=True)
    if source.suffix in ('.html', '.css', '.js'):
        text = source.read_text()
        # Also covers dynamic template paths and CSS attribute selectors so
        # source URLs and image-size selectors keep matching exactly.
        text = re.sub(r'\.(css|js|webp|png|gif|mp3|wav)(?:\?v=[A-Za-z0-9_-]+)?(?=[\x22\x27`\)])', lambda match: '.' + match[1] + '?v=' + version, text)
        target.write_text(text)
    else:
        shutil.copyfile(source, target)
(OUTPUT / '.nojekyll').touch()
print('Pages build:', version)
