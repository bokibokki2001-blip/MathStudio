# HANDOFF — MathStudio v0.1.7

## 現在の成果

- 以前の学習エンジン11/11テストを維持。285技能/485辺のカタログを提示。15技能のみ出題・採点。
- 冒険マップUI、4枚花弁、冒険EXP、全祖先の路線ガイドを実装。
- `.skill-dialog` で直接の前提に加え最大128祖先の全経路を確認可能。カタログ経路の最初の一歩と、実装済み技能の現在の挑戦可能候補を区別する。
- 画像は `assets/fantasy-map.svg`（自作SVG）と`assets/wizard-guide.svg`（AIイラスト素材の一部を再利用）。これらを単独HTMLに埋め込む。

## ソース

- `src/catalog.js`: 285技能のカタログ（改変なし）。
- `src/skills.js`,`src/engine.js`,`src/expression_grader.js`: 15技能の学習エンジン（改変なし）。
- `src/dependency_path.js`: **新設**：推移的祖先閉包、枝分かれ、最初の候補、全段階の算出。
- `src/tech_tree.js`: 新しい経路強調・4花弁アイコン・学年の舞台名。従来のカード横断回避ロジックは維持。
- `src/app.js`: 冒険ヘッダ、技能モーダル、ルート、花、レベルアップ表示。保存schemaは変更なし。
- `src/style.css`: RPG外観、アクセシビリティ配慮、オフライン背景画像。
- `tools/build_standalone.py`: 分割ファイルを読み、CSS画像URIまで埋め込む単独HTML生成。

## 変更をするときの注意

1. **学習用の実装済み15技能と285技能カタログの前提グラフは一致しません。** `MathJourney`はカタログの学習見取り図であり、`MathEngine`の解放・MASTER判定を上書きしてはいけません。
2. `firstSteps`は参考カタログ上の最初の技能、`availableActual`は現状の練習可能な祖先技能で、別概念です。将来15→285技能の教材化を進める際に、統合の可否を検証してください。
3. 学習記録キー `MathStudio.v0.1.local` と `schema_version=1` を維持。UIのルート表示状態や冒険EXPは保存不要。
4. ルート強調を再描画する際は `MathTechTree.memorize()`・`restore()`・`resetRange()` のスクロール状態に注意。固定学年見出しとツリーの同期を維持。
5. `src/style.css` と `assets/` を変更したら **`python tools/build_standalone.py` を必ず実行**。ソース版と単独HTML版が同じUIであることをテスト。
6. 既存のMASTER基準（単一混合テスト満点+時間内+全前提MASTER）を変更しない。

## テスト

- `node tests/run.js` : 11/11旧採点テスト。
- `node tests/test_dependency_path.js`: 285技能すべての完全な前提探索、複数親、重複、循環検出。
- `node tests/test_dependency_alignment.js`: 285技能の配置、前提線の無関係カード横断なし。
- `python tests/test_rpg_journey_ui.py`: ブラウザ上の経路、4花弁、実装技能への移動、5画面サイズ。
- `python tests/ui_smoke.py`: 初回診断、練習、テスト、バックアップ。
- `python tests/test_full_curriculum_ui.py`, `python tests/test_readable_map_ui.py`: 285技能/485辺、見出し・表示切替、マウスホバー。

## 次の課題

- 実装済み15技能と参考285技能の前提・習熟定義を教育的に突き合わせる。
- 285技能のうち実用上重要な単元から問題生成・採点を増やす。
- 実機WindowsでChrome/Edge、画面DPI、ブラウザ保存の挙動を検証。
- ルートが長い（最大128技能）ときに折りたたみ・系列フィルタ・自動推奨経路を検討。
- ツリーの依存線同士の交差削減と、児童向けの試用評価。
