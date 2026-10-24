"""Assemble a single-file offline HTML from the same checked-in source files."""
from pathlib import Path
root = Path(__file__).resolve().parents[1]
style = (root / 'src/style.css').read_text(encoding='utf-8')
scripts = '\n'.join((root / 'src' / name).read_text(encoding='utf-8') for name in (
    'skills.js','expression_grader.js','engine.js','tech_tree.js','app.js'))
if '</script' in scripts.lower() or '</style' in style.lower():
    raise ValueError('Closing tag inside embedded source')
html = ('<!doctype html>\n<html lang="ja"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<meta name="color-scheme" content="light">'
        '<title>MathStudio v0.1.2 — 単独ファイル版</title><style>' + style +
        '</style></head><body><div id="app" aria-live="polite">'
        '<div class="loading">MathStudio を準備しています…</div></div><script>' +
        scripts + '</script></body></html>')
out = root / 'MathStudio_v0.1.2_Standalone.html'
out.write_text(html, encoding='utf-8')
print(out)
