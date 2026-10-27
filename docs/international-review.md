# 韓国語・簡体字中国語レビュー

2026-10-27追加。韓国語 `/ko/`、簡体字中国語 `/zh-cn/`。繁体字版は今回の対象外。

## 内容と根拠

各言語14ページ：トップ、宿一覧、地域一覧、編集方針、5地域、5施設のガイド。既存の `src/content/stays-ja/` の5記事を翻訳元とし、新しい施設情報の収集は行っていない。情報確認日は元データのものを表示し、翻訳日を再調査日と扱わない。

本文は `src/content/stays-ko/` と `src/content/stays-zh-cn/`、施設名・紹介・タグ・UI・写真説明は `src/lib/international.ts`。2026-10-27に利用者が「マージ、公開にGO。」と公開承認。母語話者による独立校閲を実施したという意味ではない。KIRAKUの2027年計画、2026年11〜12月の営業未確認、軽井沢の送迎案内の相違、施設ごとの未確認事項、実泊記・未取材記事ではない旨を保持した。

写真は既存の権利確認済み5点を使用。撮影者・出典・ライセンス・撮影年は `data/photos.json` を参照し、地域風景と過去の演舞写真の説明を翻訳。京都の写真は水の庭、竹富島は集落の屋根の風景として表示する。

## 確認方法と公開境界

`npm run dev:review` または `node scripts/site.mjs dev --mode review --port 4322` を実行し、`http://127.0.0.1:4322/ko/`、`http://127.0.0.1:4322/zh-cn/` を開く。英語・日本語を含む4言語の対応するページを相互に移動できる。宿記事や地域ページでも同じ対象への切替を維持する。

新規2言語はレビュー環境に加え、`data/international-review.json` の言語別承認と内容ハッシュが一致するときだけ本番へ出力する。言語切替・hreflang・サイトマップも同じ判定を使う。ハッシュ対象は翻訳5記事、UI・画面・写真権利データ・共通CSS・公開判定等。改変後は該当言語の本番ページを除外する。デモでは生成しない。レビュー環境は引き続きnoindex、本番から草稿表示を除去する。日本語記事は変更せず、公開用リンクとhreflangのUI承認を更新した。

承認の準備・反映は `node scripts/international-review.mjs --prepare ko` / `--approve ko`（中国語は `zh-cn`）。承認済み記録の再準備は明示的なdraft化が必要で、承認時は `HUMAN_REVIEWER` と `APPROVAL_EVIDENCE` を要求する。人の承認なしでハッシュだけを更新しない。今回のmainマージ・Push・自動公開は利用者承認済み。外部の公開完了はPush後に別途確認する。

## 検証

- `node scripts/site.mjs build --mode review`：56ページ（英日28、新規28）生成。
- `node scripts/check-output.mjs dist-review review`：言語、SEO、noindex、ページ網羅、写真クレジットを検証。
- `astro sync` + `tsc --noEmit`：成功。
- `node --test scripts/pipeline.test.mjs scripts/international-review.test.mjs`：12件成功。人の承認がない場合の拒否と、翻訳・共通CSS変更後の承認無効化を隔離データで確認。
- 2026-10-27 09:50 JST、`SITE_URL` 設定後の本番ビルドと出力・写真検査：4言語56ページ、言語リンク、hreflang、サイトマップ、草稿非表示を確認。
- ローカルChrome / Playwright：両言語のトップを1440・768・390pxで撮影、画像のデコードを確認。横はみ出し・ブラウザ例外なし。宿名検索、0件表示、地域絞り込み、新規28ページからの内部リンクHTTP 200を確認。全景撮影では一部画像が描画されない撮影上の差があったため、ファーストビューの別撮影でも写真表示を目視確認。

ブラウザ検証の画像と補助スクリプトは `data/snapshots/private/international-review/`（Git除外）へ保存。翻訳の自然さや固有名詞の最終確認は、各言語を読める人の確認が必要。
