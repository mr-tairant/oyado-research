# 初回公開レビュー — 2026-10-26

状態: **2026-10-26、このチャットで利用者が5記事を承認し、初回push・新規Pages作成と公開を許可。承認記録は data/reviews/。**

現在のデモはローカルコミット `e1f3d9e` に保存済みです。実施設の調査・記事化を追加した次のコミットは、レビューと検証を終えて作成します。

## 確認する記事

ローカルで `npm run dev:review` を起動し、[レビュー一覧](http://127.0.0.1:4322/stays/)を開いてください。実行中のプレビューは同じURLです。レビュー用出力は `dist-review/`、通常出力 `dist/` とは分離し、noindexと空sitemapを設定しています。機密アクセス制御ではないため、レビュー成果物を外部へデプロイしないでください。

|施設|地域|レビュー画面|英語Markdown|
|---|---|---|---|
|Yamatoya Honten|愛媛・四国|http://127.0.0.1:4322/stays/yamatoya/|../src/content/stays/yamatoya.md|
|HOSHINOYA Taketomi Island|沖縄|http://127.0.0.1:4322/stays/hoshinoya-taketomi/|../src/content/stays/hoshinoya-taketomi.md|
|HOSHINOYA Karuizawa|長野・中部|http://127.0.0.1:4322/stays/hoshinoya-karuizawa/|../src/content/stays/hoshinoya-karuizawa.md|
|KIRAKU ONSEN LIVING|山形・東北|http://127.0.0.1:4322/stays/kiraku/|../src/content/stays/kiraku.md|
|HOSHINOYA Kyoto|京都・関西|http://127.0.0.1:4322/stays/hoshinoya-kyoto/|../src/content/stays/hoshinoya-kyoto.md|

## 調査上の判断

- 保存したseed 42の最終抽選を維持しました。有料検索API・OpenAI APIの呼び出しは0件。Codexが検索機能で公式公開情報と検索索引を確認し、根拠付きの英語草稿を作成しました。
- 5施設×7媒体=35チェックを実施。確認済みURLは公式5件＋喜らくの公式サイトが直接リンクする楽天・じゃらん・Bookingの3件。その他は掲載候補・未確認・編集記事のみとして記録。未確認URLは公開画面の予約リンクに使用しません。
- 大和屋本店は松山市の施設です。同名の大阪の宿は除外。食事場所は情報が一致しないため掲載を控えています。
- 喜らくは2026年10月時点の案内と、2027年1月開始予定の新客室・飲食店計画を明確に区別。11〜12月の稼働状況は未確認。
- 星のや軽井沢は概要ページとアクセス専用ページで送迎乗り場が異なるため、現在の駅名を確定情報として掲載していません。
- 星のや京都と竹富島の一般的な「Facilities」ナビゲーションだけで温泉・プールの存在を推測しません。竹富島のプールは個別の設備数記載で確認。
- 取材未実施のためOwner Interviewは非表示。ホテル写真・口コミ・価格・外部スクリーンショットは使用していません。

## 公開先と承認後の操作

利用者指定: 新規Cloudflare Pagesプロジェクト **oyado-journal**、予定URL **https://oyado-journal.pages.dev**。プロジェクト名の利用可否はアカウント接続後に確認します。GitHubの公開リポジトリは https://github.com/mr-tairant/oyado-research です。

1. 利用者が5記事の内容と初回push・公開を承認。
2. 承認対象のハッシュを照合し、`scripts/review.mjs` で各記事に実際の承認者と日時を記録。Codex自身を人間の承認者として記録しません。
3. `SITE_URL=https://oyado-journal.pages.dev` で `npm run build:production`、出力検証、テストを実施。
4. ローカルコミット、利用者承認後にGitHub mainへ初回push。
5. Cloudflareに利用者がログインして対象アカウントを確定。新規Pagesを作成し、承認済みdistを公開。Git連携または手動実行のpublish workflowを使用。
6. 公開URL・5詳細ページ・canonical・sitemapを検証。

Cloudflareに利用者がログインして対象アカウントを確定します。APIトークンをチャットへ貼らず、必要ならCloudflare/GitHubの画面やローカル環境変数へ直接設定してください。pushと公開の実行結果は検証記録に追記します。
