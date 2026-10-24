# TESTING — MathStudio v0.1.8

## Passed locally
- 従来11/11スイート（79技能合計35,550件の問題生成・模範解答採点）。
- 新規 `test_expanded_lessons.js`：79技能・合計40,290生成採点、うち4,760式の数量関係確認、237混合テストで同一文面の重複なし。新64技能の全直接前提が実装済み。
- `test_expanded_ui.py`：新しい基礎技能を開く→練習→完全マスターテストで満点→後続技能がアンロックされることをChromium+Playwrightで確認。
- `ui_smoke.py`：初回診断、従来技能のテスト、JSONエクスポート/インポート。
- `test_rpg_journey_ui.py`：全祖先経路、4花弁、画面5サイズ。
- `test_full_curriculum_ui.py`：285技能・485辺、範囲切替・未実装技能のブロック。
- `test_readable_map_ui.py`：スクロール・固定見出し。

## Not yet verified
- 自宅Windows PCの実機Chrome/Edge（Linux Chromium自動テストのみ）。
- 小学生による問題の読みやすさ、理解度、難易度、目標時間、知識の定着。
- 図形の作図、時計の針を動かす入力、グラフの作成といった操作課題。
- 数値のみ採点する文章題の途中の考え方。

模範解答が自動採点で正解になる事実だけを、教育的妥当性の証明としないこと。
