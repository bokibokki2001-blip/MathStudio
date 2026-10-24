# HANDOFF — MathStudio v0.1.6

## 現状

ユーザーは学校Chromebookのi-Filter制限により**自宅PCでのオフライン利用**へ変更。i-Filter回避実装は不要。

- `src/catalog.js`：285の暫定技能と485本の表示用前提関係（小143・中66・高76）。高校は数学Ⅰ/A/Ⅱ/B/Ⅲ/Cの科目別。
- `src/skills.js` と `src/engine.js`：練習・採点可能な**15技能のみ**。残り270技能は教材準備中で、合否やMASTERを付けない。表示用285技能の前提関係と15技能の評価用前提関係はまだ統合していない。
- `src/app.js`：画面遷移、4宝石、ポップアップ、検索、バックアップ。
- `src/style.css`：上部の圧縮UIと固定学年見出し。
- `tools/build_standalone.py`：1ファイルHTMLを生成。

## v0.1.6 配置アルゴリズム

1. `src/tech_tree.js:makeLayout` では、同一学年・科目の前提グラフをトポロジカル層に分割。スキルは常に前提より右に配置。学年列の幅は内部層数で決まる。横方向のスクロール増加は設計上許容。
2. `number/measure/geometry/... ` の分野ごとに全ステージ共通の縦帯を設定。前提・発展の位置を参照する双方向12回の調整と、列内の重複を禁じる最小コストのスロット割当てで高さを合わせる。
3. `routePoints` は、線分が別のカードに衝突しない場合は**直線**。衝突する場合のみ列間ガターを経て行間の安全な経路へ迂回。別カード内部を横断しないことは6表示範囲・延べ1,069リンクの幾何検査で確認。**リンク同士の交差・重なりまでは未解決**。
4. `fit()` はリサイズ時にスクロール位置を戻さない。選択技能のフォーカス、固定学年見出しの水平方向同期、ホバーハイライトは継続。
5. 小1〜3の平均前提高低差539→170px、小4〜6 504→163px。全表示では484→352px。延べ637経路が直線。

## 引継ぎ上の注意

新しく教材を加える際は出題エンジンと採点・診断の妥当性を検証し、既存のMASTER履歴を壊さずに表示用の前提グラフとの統合を設計すること。バックアップJSONスキーマとLocalStorageキーは変更しない。ソースに個人の学習履歴や秘密鍵を置かない。

`node tests/run.js`（11スイート・6750問）、`node tests/test_tech_tree.js`、`node tests/test_dependency_alignment.js`、`python tests/test_full_curriculum_ui.py`、`python tests/test_readable_map_ui.py`、`python tests/ui_smoke.py`、`python tests/test_regrade_ui.py` が回帰検査。家庭PC実機での表示・永続保存は未検証。
