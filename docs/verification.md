# 検証記録 — 2026-10-26 JST

## 最新: 実施設5件の公開完了

- Astro 7.4.2 / Node 24。本番ビルドと型チェックに成功。型チェックはクリーン環境でも動くようastro syncを先行実行。
- 公開承認、承認後改変検知、改行差、施設同一性、設定誤りを含む11テストに成功。
- GitHub CI [40270475231](https://github.com/mr-tairant/oyado-research/actions/runs/40270475231) 成功。
- Cloudflare PagesのGitHub連携によるデプロイ成功。公開URL: https://oyado-journal.pages.dev/。
- 実施設5詳細を含む14ページと3アセットの公開HTTP検証に成功。canonical・構造化データ・sitemap・robots・OGP、デモの混入なしを確認。
- ブラウザーで実施設一覧と検索を確認。公開用依存関係監査は0件。
- 初回の有料API呼び出しは0件。検索機能と公式公開情報からCodexが記事を作成し、利用者が明示承認。Owner Interviewは未取材のため非表示。

詳細は release-status.md と data/logs/live-verification.json を参照。

## 履歴: 初期デモ検証

- Node 24.22.1 / Astro 5.18.2。端末にnpmが無いため一時npm CLIから実行。
- `npm ci`: 一時フォルダーで280パッケージのクリーンインストール成功。
- `npm run build`: 公開検証ゲートを含め成功。14 HTMLページとrobots.txt / sitemap.xmlを静的生成。
- TypeScript型チェック: エラーなし。
- `npm test`: 4件成功（再現抽選、引数検証、未承認データの拒否、productionでのデモのみ公開拒否）。
- 最終5施設詳細ページ: localhost HTTP 200、架空サンプル名、noindex、未取材Interview非表示を確認。
- ブラウザー: トップ、5施設一覧、Designタグ検索で2件、Chubu地域フィルターで1件を確認。
- モバイル390px幅: トップの表示と横方向のあふれが無いことを確認。
- Python取得・スクリーンショット: 許可リストが空の場合、取得／ブラウザー起動前に拒否することを確認。
- 有料検索API・OpenAI APIと、外部ページの実取得・スクリーンショットは未実行。Python抽出は許可取得HTMLでの実地検証が必要。
- GitHubへのコミット・push、Cloudflareのアカウント操作・公開デプロイは未実行。

公開承認済み実施設記事は0件。公式候補の探索根拠と架空記事は分離しています。実施設の詳細情報を検証済みとして表示してはいません。
