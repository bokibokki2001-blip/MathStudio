# TESTING — MathStudio v0.1.7 (2026-10-24)

## この環境で確認したこと

| テスト | 結果 |
|---|---|
| `node tests/run.js`（数式・採点・MASTER・初回診断の既存11スイート） | PASS 11/11 |
| `node tests/test_dependency_path.js`（全285技能の推移的祖先、分岐・合流、循環） | PASS、最大128祖先 |
| `node tests/test_dependency_alignment.js`（全範囲計1,069辺の経路検査） | PASS、無関係カード内部横断0件 |
| `node tests/test_tech_tree.js`（配置・前提関係の構造） | PASS |
| `python tests/test_rpg_journey_ui.py`（実ブラウザ・全経路ポップアップ・4花弁・ジャンプ・練習） | PASS |
| `python tests/test_full_curriculum_ui.py`（全285・485、範囲・検索・未実装ブロック） | PASS |
| `python tests/test_readable_map_ui.py`（5画面サイズ・固定学年見出し・経路ホバー） | PASS |
| `python tests/ui_smoke.py`（診断・練習・テスト・JSON保存/再読込） | PASS |

## ブラウザの確認環境

自動Chromium (`/usr/bin/chromium`, Linux, Playwright) でテスト。画面サイズ: 1920×1080 / 1440×900 / 1280×720 / 1024×768 / 800×600。いずれもページ全体の縦方向のはみ出しなし。ツリー内部の縦横スクロールは必要に応じて使う仕様。

## 確認上の限界

- 自宅Windows PC / Chrome / Edgeの実機動作は未確認。`file://` 直開きでのブラウザポリシー差については、単独HTMLをブラウザ上で仮想ページとしてテストしただけです。
- カリキュラム285技能の教育的妥当性・難易度・各学年の学習順序は未校正。
- レベル演出、花形UIがモチベーションを高めるかは児童ユーザーテスト未実施。
- 単独HTML画像は埋込方式で生成したが、Chromium以外のブラウザ固有の描画差は未検証。
- `MathJourney`は参照カタログ上の経路であり、実装15技能の現行エンジンとは独立。未実装270技能はルートに表示されても挑戦不可。

## 既知の制約

- 大規模な高校範囲では数十〜128の祖先技能が生じるため、ルート一覧は長くなりスクロールを必要とする。
- 線同士の重なり・交差は完全には除去していない。背景コントラストとルート強調で追えるようにした。
- レベルUP・ゲーム演出は進行補助であり、学習評価や達成認定を代替しない。
