# MathStudio v0.1.9 — 285技能の問題実装版

MathStudioは、算数・数学をRPG風の技能ツリーで学ぶ個人用オフラインブラウザアプリです。自宅PCのChrome/Edgeで、サーバー・アカウント・APIなしに利用できます。

## 対応範囲
- **285/285技能**に基本・応用・文章題の出題と機械採点を実装。内訳は小学校143、中学校66、高校数学76技能。
- 前提関係485本のカタログを参照。旧15技能の前提は既存履歴との互換のため元のまま維持。
- 数値・分数・限定的な式の採点に加え、概念選択問題を追加。
- 4つの花の宝石、仮アンロック75%、全問正解・時間内・前提MASTERを条件とするMASTER、全祖先の学習経路、JSON履歴保存を維持。
- 新しい206技能は `src/advanced_questions.js`、v0.1.8の64技能は `src/extended_questions.js`、既存15技能は `src/engine.js` に出題処理がある。

**重要**：出題できることと単元全体を評価できることは別です。証明、作図、数学的考察、複雑な数式変形、表・グラフの直接操作は部分的な数値・概念選択問題に限られます。表示するMASTERはアプリ内の代表問題への合格であり、学校教育の単元修了や技能全体の習得保証ではありません。カリキュラム・難易度は教育専門家による未校正です。

## 始め方
1. [配布ZIP](https://github.com/bokibokki2001-blip/MathStudio) から `MathStudio_v0.1.9_Standalone.html` を取得するか、GitHub Pagesの `index.html` を開きます。
2. 初回診断は小学向けの従来4系列のみです。中学・高校数学は技能マップから選択してください。
3. 練習・混合テストを使い、設定・バックアップからJSONを定期保存してください。旧版の履歴を引継ぎできます。

## テスト
```bash
node tests/test_all_curriculum.js
node tests/run.js
node tests/test_expanded_lessons.js
python tools/build_standalone.py
python tests/test_browser_285.py
```
詳しくは `TESTING.md`、制限は `SPEC.md`、引継ぎは `HANDOFF.md` を参照してください。学習記録・個人情報を公開リポジトリに置かないでください。
