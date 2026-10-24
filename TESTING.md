# TESTING — MathStudio v0.1.9 (2026-10-24)

## 実行済みの検査
| コマンド | 結果 |
|---|---|
| `node tests/test_all_curriculum.js` | PASS — 285×3×80＝**68,400問**の生成・模範解答採点、**855混合テスト**、選択肢の誤答拒否、問題文重複なし |
| `node tests/run.js` | PASS **11/11テスト**、合計128,250問の生成・採点、旧版の採点修復・MASTER・速度宝石 |
| `node tests/test_expanded_lessons.js` | PASS — 145,350問の生成・採点、855混合テスト |
| `python tests/test_browser_285.py` | PASS — Chromium/Playwrightで285技能の出題、選択式UI→採点→練習終了、ブラウザJSエラーなし |
| 旧UIスクリプト | 固定15/79技能数・旧ファイル名を仮定するものは最新版には不適合 |

## 検証できていないこと
- 模範解答を作った同じ生成器による自己テストは、問題文の数学的正しさや教育的品質を独立に保証しない。
- 自由証明・作図・統計的推論・高度な数式変形の全過程を採点する機能はない。MASTERは代表問題内だけ。
- 問題の難易度・所要時間、カリキュラムの必須事項との照合、家庭のWindows PC実機での長期間の履歴保存は未検証。

## 実行
```bash
node tests/test_all_curriculum.js
node tests/run.js
node tests/test_expanded_lessons.js
python tools/build_standalone.py
python tests/test_browser_285.py
```
