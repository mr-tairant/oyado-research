# 初回実施設リリース

- 2026-10-26: 利用者が実施設5記事を承認し、GitHub初回pushと新規Cloudflare Pages公開を許可。
- デモ保存: e1f3d9e。
- 実施設記事・承認記録: 2e8a1ee。GitHub mainへの初回push成功。
- 初回CIは型生成前のtypecheckで失敗。typecheckにastro syncを追加し、クリーン環境への対応を修正。
- 依存関係監査を受け、Astroを7.4.2へ更新。更新後の本番ビルド、14ページの出力検証、型チェック、11テストに成功。公開用依存関係のnpm auditは0件。
- Cloudflareアカウントへのログインを確認。新規プロジェクトoyado-journalをGitHub mainと連携して作成。
- GitHubの修正後CI: [40270032898](https://github.com/mr-tairant/oyado-research/actions/runs/40270032898) 成功。
- Cloudflare初回ビルドはWrangler設定に環境変数が無いため安全に停止。PUBLICATION_MODE / SITE_URL / NODE_VERSIONを管理元のwrangler.tomlへ追加し、再デプロイを実施。

## 公開完了

- URL: **https://oyado-journal.pages.dev/**
- 初回成功デプロイ: 329527b9-ebd1-44a5-8a6e-78c8352003ab。Cloudflare管理画面でStatus: successを確認。
- 公開ソース: fc84ae6797becb24ba46af69ff8abe03fff9e6be。
- 同コミットのGitHub CI: [40270475231](https://github.com/mr-tairant/oyado-research/actions/runs/40270475231) 成功。
- 公開URLの14 HTMLページ、5施設の構造化データとcanonical、sitemap.xml / robots.txt / og.pngをHTTP 200で検証。公開画面にデモ・草稿表示が無いことも確認。
- 公開ブラウザーで施設名検索（Kyoto → 1 stay）を確認。
- 実行記録: data/logs/live-verification.json。再検証コマンド: `node scripts/check-live.mjs`。
- 今後mainへのpushでCloudflareの自動ビルドが起動。公開検証を通った承認済みの記事だけを出力します。
