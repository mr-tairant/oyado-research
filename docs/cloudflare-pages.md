# Cloudflare Pages

この実装では外部アカウント操作・push・デプロイを実行していません。

設定根拠: [Cloudflare公式Astroガイド](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)。

1. GitHubリポジトリへレビュー済み変更をpush（実行前に利用者承認）。
2. Cloudflare PagesでGitHub連携と対象リポジトリを選択。Astro静的サイトとして設定。
3. Build command: `npm run build`、Output directory: `dist`、Root: `/`、Node: `24`。
4. プレビューは PUBLICATION_MODE=demo。これは架空サンプルでnoindexです。プレビュードメインも SITE_URL に設定できます。
5. 本番は PUBLICATION_MODE=production と SITE_URL=https://実ドメイン を指定。承認済みの実施設が無い場合ビルドは意図的に失敗します。
6. APIキーはPagesに設定不要。検索・生成はローカルで行い、人が検証したデータだけGitHubへ追加します。
7. 承認後の公開はPagesのGit連携または `npx wrangler pages deploy dist --project-name oyado-journal`。実行前に利用者確認。

`wrangler.toml` に静的出力先を定義。DB、Workersアダプターは不要です。カスタムドメイン設定後はcanonical・sitemap・OGPのURLを確認してください。OG画像は自作SVGから生成したPNGを利用しています。
