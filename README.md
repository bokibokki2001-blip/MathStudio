# MathStudio v0.2.0 — 算数・数学の冒険マップ

自宅PCのChrome/Edgeで動作する個人用のオフライン学習アプリです。小学校〜高校数学の285技能に問題生成・自動採点を実装し、4つの宝石の花、前提技能ツリー、練習・混合テスト、JSONバックアップを備えます。**実際に教材の学習効果・難易度を保証するものではありません。**

## v0.2.0の新機能

- **教材デバッグ**：全285技能を名称・IDで検索し、ロックを無視して基本・応用・文章題を出題、模範解答・採点結果を確認。混合テストを模擬実行しても習熟度・MASTER・履歴に影響しません。
- **教科書別標準進度（試作）**：設定から教科書会社、小学1〜6年、月を選択し、「学習の記録」で標準進度（期待習得技能数）と現在のMASTERを比較。月別一覧も表示。JSONに選択を保存。
- 選択肢：東京書籍、大日本図書、啓林館、学校図書、教育出版、日本文教出版、共通暫定モデル。

### 重要：出版社別データの適用範囲

**小学4年の東京書籍・大日本図書・啓林館のみ**2024年度版の公開年間指導計画の単元順と時期を元に、26技能への月割りを**推定**しています。正確な単元終了月ではありません。その他の出版社・小1〜3/小5〜6は出版社別の違いを含まない共通暫定モデルを用いており、中高の出版社別進度は未対応です。現時点の比較は技能数の単純集計で授業時数や難易度を反映せず、初回診断の開始位置も教科書連動していません。

資料：
- 東京書籍 https://ten.tokyo-shoseki.co.jp/text/shou/sansu/data/sansu_keikaku_ryakuan_4_20240131.pdf
- 大日本図書 https://www.dainippon-tosho.co.jp/sansu/files/r6sansu4thSH.pdf
- 啓林館 https://www.shinko-keirin.co.jp/keirinkan/sho_r6/sansu/file/sansu_guidance_plan04.pdf

## 起動方法

GitHub Pagesの公開サイト、または `python tools/build_standalone.py` で作成する `MathStudio_v0.2.0_Standalone.html` をChrome/Edgeで開きます。学習記録はブラウザ側に保存し、定期的にJSONバックアップしてください。学習履歴を公開リポジトリにアップロードしないでください。

## ソースとテスト

`src/textbook_schedule.js`：教科書と標準進度の暫定データ。 `src/app.js`：デバッグ・設定・進度画面。 `src/engine.js` 等：出題・採点。 `src/catalog.js`：285技能と前提技能。ビルドは `tools/build_standalone.py`。

```bash
node tests/run.js
node tests/test_all_curriculum.js
node tests/test_textbook_schedule.js
python tools/build_standalone.py
```

教育的未検証点：記述証明、作図、高度な数式変形や統計的考察は部分的な数値・選択式での評価にとどまります。開発の判断と既知の制限は `SPEC.md` / `HANDOFF.md` に記載しています。
