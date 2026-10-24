# HANDOFF — MathStudio v0.1.8

## Changes
実装技能は15→79。 `src/skills.js` に参照カタログ由来の追加64技能、`src/extended_questions.js` に各技能×3カテゴリの教材を実装。`src/engine.js` の `kind=extended` 分岐で新問題を生成する。

## Script load order
`catalog.js → skills.js → expression_grader.js → extended_questions.js → engine.js → dependency_path.js → tech_tree.js → app.js`

`tools/build_standalone.py` を実行すると1枚HTMLを再生成できる。GitHub `index.html` は単独HTMLとして起動可能。ローカルZIPでは分割ソースも保持する。

## Backward compatibility
保存キー `MathStudio.v0.1.local` とschema 1を変更していない。旧15技能の前提定義を維持し、記録済みMASTERを無断で無効化しない。新64技能は参考カタログの前提閉包を満たす。新旧の前提定義が一部異なるため、将来統合するときには記録移行を設計すること。

## Tests and next steps
- `node tests/run.js` / `node tests/test_expanded_lessons.js`
- `python tests/test_expanded_ui.py` / `python tests/ui_smoke.py`
- ブラウザの全範囲カタログ表示・前提経路確認も継続検証。
- 次は、小4後半から小6の分数・割合・速さ・比例、図形の操作型入力を拡張。
- 目標時間や難易度の校正、正答判定が意味に適合するかの独立レビュー、Windows実機検証が必要。
- 版更新時には `SPEC.md`, `HANDOFF.md`, `CHANGELOG.md`, `TESTING.md`, `START_HERE.md` を再更新する。
