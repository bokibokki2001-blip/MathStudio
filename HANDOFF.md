# HANDOFF — MathStudio v0.1.4

## 現状
- 自宅PCのオフライン使用を想定。学校Chromebookのi-Filter制限を回避する変更は不要。
- `src/catalog.js` に全285技能・485前提関係。小学校143、中学校66、高校数学76技能を表示できる。
- `src/skills.js` に採点が動く15技能。その他270技能は教材準備中。両者を**混同しない**。表示用485リンクと評価用の暫定15技能グラフは独立。
- 学年の最上段が見出しで切れる不具合を修正。学年見出しはツリーのスクロール領域外で固定、横移動には同期する。
- 表示範囲の細分化・全285技能表示・検索・ポップアップで前提技能ジャンプを実装。ツリー画面はページ縦スクロールなし、マップ内部には必要なスクロールが残る。

## 構成
- `src/catalog.js`：全285技能の埋め込み、学年・科目・領域・前提、範囲定義。
- `src/skills.js`：動作15技能（試作の評価用前提）。
- `src/tech_tree.js`：285マップ配置・485線・固定見出し・倍率・横方向同期。
- `src/app.js`：画面・ポップアップ・検索・バックアップ。
- `src/engine.js` と `src/expression_grader.js`：問題生成・採点・診断。15技能のみ。
- `src/style.css`：スクロール・固定見出しを含むUI。
- `tools/build_standalone.py`：全JS/CSSを単独HTMLへ合成。
- 配布用ZIPには `reference/curriculum_285_v0.1.json` の詳細な暫定草案を含める。

## 保存と今後
既存LocalStorageとJSONのschema_version=1を維持。HTMLのファイル名・場所・ブラウザ変更時は旧版のJSONを書き出してから新版に読み込む。児童の学習データを公開GitHubへ置かない。

課題：270技能の教材実装、285グラフへMASTER判定を移す際の互換性設計、485前提の教育的検証、図形・筆算・高数の入力と採点、難易度と標準進度の校正。全285を一度に縮小すると読みにくいため、通常は学年帯別表示を推奨。

実行検証は `node tests/run.js`、`node tests/test_tech_tree.js`、`python tests/test_full_curriculum_ui.py`、`python tests/ui_smoke.py`、`python tests/test_regrade_ui.py`。実機Windowsでの使用は未検証。