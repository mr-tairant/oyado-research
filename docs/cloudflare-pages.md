# Cloudflare Pages

公開先は利用者指定の新規 **oyado-journal**、標準ドメイン **https://oyado-journal.pages.dev** です。2026-10-26に5記事の内容・初回push・新規Pages作成と公開の承認を受けました。接続設定と公開完了は別途検証記録に残します。

設定根拠: [Cloudflare公式Astroガイド](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)。

1. GitHubリポジトリへレビュー済み変更をpush（実行前に利用者承認）。
2. Cloudflare PagesでGitHub連携と対象リポジトリを選択。Astro静的サイトとして設定。
3. Build command: `npm run build:production`、Output directory: `dist`、Root: `/`、NODE_VERSION: `24`。
4. ローカルレビューは PUBLICATION_MODE=review、出力dist-review。外部へデプロイしません。demoは架空サンプルでnoindexです。
5. 本番は PUBLICATION_MODE=production と SITE_URL=https://oyado-journal.pages.dev を指定。抽選5施設の承認と改変チェックを通過しなければビルドは失敗します。
6. APIキーはPagesに設定不要。検索・生成はローカルで行い、人が検証したデータだけGitHubへ追加します。
7. 承認後の公開はPagesのGit連携または `npx wrangler pages deploy dist --project-name oyado-journal`。実行前に利用者確認。

`wrangler.toml` に静的出力先を定義。DB、Workersアダプターは不要です。カスタムドメイン設定後はcanonical・sitemap・OGPのURLを確認してください。OG画像は自作SVGから生成したPNGを利用しています。

実プロジェクトはGitHub連携方式です。mainへのpushでCloudflareの本番ビルドとデプロイが自動起動します。現在のWrangler設定が環境変数の管理元となるため、PUBLICATION_MODE / SITE_URL / NODE_VERSIONはwrangler.tomlのvarsに記録し、Nodeバージョンは.node-versionにも固定しています。ダッシュボードの入力だけではWrangler設定に上書きされる点に注意してください。公開検証ゲートを通らないビルドは公開されません。

別途、手動デプロイをGitHub Actionsから行う場合は `.github/workflows/publish.yml` を使用。Cloudflare Pages編集権限を対象アカウントに限定したAPIトークンとアカウントIDをGitHub Secrets（CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID）へ直接設定し、production environmentの実行権限を設定します。ActionsでconfirmationにPUBLISHを入力して実行。このworkflow自体は通常のpushでは起動しませんが、接続済みCloudflareの自動ビルドは起動します。

参考: [Cloudflare公式・CIからのDirect Upload](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/)。Git連携を選ぶ場合はAPIトークンを作る必要はありません。
