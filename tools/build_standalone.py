"""Build MathStudio v0.2.0 as a self-contained offline HTML."""
from pathlib import Path
import base64
root = Path(__file__).resolve().parents[1]
style = (root / "src/style.css").read_text(encoding="utf-8")
for filename, mime in [("fantasy-map.svg","image/svg+xml"),("wizard-guide.svg","image/svg+xml")]:
    data = base64.b64encode((root/"assets"/filename).read_bytes()).decode("ascii")
    style = style.replace("../assets/"+filename, "data:"+mime+";base64,"+data)
script_names = (
    "catalog.js","textbook_schedule.js","skills.js","expression_grader.js",
    "extended_questions.js","advanced_questions.js","engine.js",
    "dependency_path.js","tech_tree.js","app.js",
)
scripts = "\n".join((root/"src"/name).read_text(encoding="utf-8") for name in script_names)
if "</script" in scripts.lower() or "</style" in style.lower():
    raise ValueError("Closing HTML tag inside embedded source")
page = ('<!doctype html>\n<html lang="ja"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<meta name="color-scheme" content="light">'
        '<title>MathStudio v0.2.0 — 単独ファイル版</title><style>' + style
        + '</style></head><body><div id="app" aria-live="polite">'
        + '<div class="loading">MathStudio を準備しています…</div></div><script>'
        + scripts + '</script></body></html>')
out = root/"MathStudio_v0.2.0_Standalone.html"
out.write_text(page, encoding="utf-8")
print(out)
