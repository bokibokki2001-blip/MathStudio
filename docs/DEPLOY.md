# GitHub Pages公開手順

1. リポジトリの Settings → Pages を開く。
2. Build and deployment の Source を `Deploy from a branch` にする。
3. Branch は `main`、folder は `/(root)` を選び Save。
4. GitHub Pagesのデプロイ後に `https://bokibokki2001-blip.github.io/MathStudio/` を開く（学校側のアクセス制限を確認）。

公開するのはアプリのソースと教材案だけです。娘さんの学習記録、バックアップJSON、氏名、APIキーをコミットしないでください。サイトの `localStorage` は閲覧端末とブラウザにのみ保存され、別の端末とは自動同期しません。学校の管理設定によって消去される可能性があるので、JSONを書き出して個別に保管してください。

2026-10-24時点のアプリはv0.1.1試作版です。実装済み教材は15技能だけであり、同梱の285技能案を全て解けるわけではありません。
