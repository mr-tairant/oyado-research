# 写真の取得と管理

`node scripts/photos.mjs` は選定済みのWikimedia Commons写真5点のみを取得します。有料APIは不要です。HTTP 429にはRetry-Afterに従い最大60秒待機、1回のみ再試行します。認証やアクセス制限は回避しません。取得済み証跡は再利用します。

- `data/photos.json`：公開用台帳。撮影者、撮影時期、ライセンス、出典、取得日時、確度、確認状態、画像ハッシュ。
- `data/snapshots/photo-rights/`：Commons APIの権利情報取得記録。
- `data/snapshots/private/photo-originals/`：元画像（Git対象外・内部資料）。
- `src/assets/photos/`：長辺最大1800pxのWebP。Astro Imageがレスポンシブ画像を生成。

公開画面には撮影者・出典リンク・ライセンスリンク・撮影年・加工表示を掲載します。派生画像にも元と同じライセンスを適用します。写真のライセンスはサイトのソースコードに一律適用するものではありません。

軽井沢の雲場池、蔵王温泉のパノラマは地域風景です。施設写真とは明記して区別しています。竹富島はファイル名にOkinawaとありますが、2012年撮影およびCommonsの竹富島施設カテゴリを確認しています。大和屋本店の能舞台は2009年の演舞写真であり、現在の公演開催を保証しません。撮影者名はCommons表示に従い、竹富島写真のEXIFにはAkifumi Yamabeの記載もあるため併記します。

公式サイトの写真やページスクリーンショットに再掲載許可があるとは扱いません。今回、公開写真は上記ライセンス画像のみです。

## 日本語版

`npm run dev:review` の `/ja/` で確認します。記事は `src/content/stays-ja/`、日本語UIは `src/pages/ja/[...page].astro`。新規日本語記事は draft として扱い、未承認のproductionではルート自体を生成しません。英語の既存承認を日本語の記事承認として転用しません。

`node scripts/review-japanese.mjs --prepare` で5記事と日本語UIのハッシュを `data/japanese-review.json` に保存します。ユーザーの内容承認後に、`HUMAN_REVIEWER` と `APPROVAL_EVIDENCE` を環境変数に設定し `node scripts/review-japanese.mjs --approve` を実行します。個別Markdownは生成時のdraftを維持し、一括レビュー記録が公開可否を決定します。承認後の変更はハッシュ不一致で日本語ページの公開対象から外れます。承認済みの場合のみ言語リンク、hreflang、サイトマップ、日本語の施設構造化データが本番に含まれます。

`node scripts/check-photos.mjs dist` で写真のハッシュ、権利証跡、地域風景ラベル、公開HTMLのクレジットとレスポンシブ画像を検証します。
