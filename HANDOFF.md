# HANDOFF — MathStudio v0.1.9

- 出題対応は285/285技能（既存15＋v0.1.8の64＋新206）。新技能は `src/advanced_questions.js` に個別定義。
- 必須のロード順：`catalog.js → skills.js → expression_grader.js → extended_questions.js → advanced_questions.js → engine.js → dependency_path.js → tech_tree.js → app.js`。 `tools/build_standalone.py` で単独HTML生成。
- 数値・限定式のほか `inputMode='choice'` に対応。選択問題の `answer` は1始まりの選択肢番号、`options` は文字列配列。3カテゴリがあり、混合テスト内の同一テキストを避ける。
- 旧保存キー `MathStudio.v0.1.local`、JSONスキーマ1、従来15技能の前提定義は互換性のため保持。新270技能は暫定カタログ前提。
- MASTERは当該問題集に対する内部判定。記述証明・作図・統計的考察・高度な式変形を網羅したとは説明しない。
- 285技能×3カテゴリ×80乱数で68,400問、855混合テスト、回帰11テスト、Chromiumの選択UIを検証。これらは主に**自己採点の整合性**であり教育的妥当性の第三者監査ではない。
- 初回診断は小学の基礎4系列のみ。公開試験・学習指導要領と照合した難易度や時間は未校正。
- 次の優先事項：数学的に独立した解答検証、教材の人手監修、自由証明/作図の採点方式、前提技能の統一、全学年の適応診断、長期保存の実機テスト。
- リリースZIPには `START_HERE.md`・`SPEC.md`・`HANDOFF.md`・`CHANGELOG.md`・`TESTING.md` を含める。GitHubに個人の学習履歴JSONは置かない。
