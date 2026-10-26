# 初回実施設リリース

- 2026-10-26: 利用者が実施設5記事を承認し、GitHub初回pushと新規Cloudflare Pages公開を許可。
- デモ保存: e1f3d9e。
- 実施設記事・承認記録: 2e8a1ee。GitHub mainへの初回push成功。
- 初回CIは型生成前のtypecheckで失敗。typecheckにastro syncを追加し、クリーン環境への対応を修正。
- 依存関係監査を受け、Astroを7.4.2へ更新。更新後の本番ビルド、14ページの出力検証、型チェック、11テストに成功。公開用依存関係のnpm auditは0件。
- Cloudflareアカウントへのログインを確認。新規プロジェクトoyado-journalの作成と公開を進行中。
- GitHubの修正後CI: [40270032898](https://github.com/mr-tairant/oyado-research/actions/runs/40270032898) 成功。
- Cloudflare初回ビルドはWrangler設定に環境変数が無いため安全に停止。PUBLICATION_MODE / SITE_URL / NODE_VERSIONを管理元のwrangler.tomlへ追加し、再デプロイを実施。

公開の成功・実URLはデプロイ完了後に追記します。ここに成功の記載がない時点では、公開完了を意味しません。
