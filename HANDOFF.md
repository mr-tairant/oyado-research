# 最新の引き継ぎ

- 記録日時：2026-10-27T10:20:43.047+09:00（JST）。
- 記述時点の基点HEAD：f283171045d9c20a7691579eab7ac92b5ccd50bb。作業ブランチ：codex/interview-sales-samples。今回の文書を含む将来のCommitとは区別。
- 2026-10-27のfetchでorigin/mainと基点が一致。作業開始時はクリーン。Push直前に再fetchする。

## 現状と承認

- 前回の4言語公開はf283171でmainへ送信済み。GitHub CI・Cloudflare成功、公開56ページのHTTP・言語表示・リンクを確認済み。
- 今回は商談用の日本語架空インタビュー2本と一覧を追加。山の宿は架空オーナーの写真風ポートレート、町家は架空女将の水彩イラスト。背景画像を含めAI生成素材6点を保存し、現行画面では人物2点・中面2点を使用。
- 利用者は完成サンプル確認後「OK。公開まで進めて。」と明示承認。今回のファイルのCommit・mainマージ・Push・本番公開が対象。実取材の承認ではない。
- /ja/samples/interviews/ 以下の3ページ。架空・AI表記とnoindexを維持、サイトマップ非掲載。通常のOwner Interviewは未取材・非表示のまま。実施設データや既存記事、承認対象ファイル、依存・CIは変更なし。
- 詳細・対象ファイル：[商談用サンプル](docs/interview-samples.md)、[画像とプロンプト](docs/interview-sample-images.md)。

## 今回の検証

- 2026-10-27：Astro sync・TypeScriptチェック成功。12テスト成功。
- 本番59ページのビルド・出力・写真検証成功。サンプル3ページの架空・AI表記と検索対象外設定、既存4言語の承認有効を確認。
- ローカルChromeで1440/768/390px、人物のトリミング、プロフィール、記事間リンク、印刷時の架空表記を確認。撮影等はdata/snapshots/private/interview-samples/（Git除外）。

## 次の手順・未確認

- この記録時点は公開準備Commit・mainマージ・Push前。承認済み差分を送信し、公開URL・CI・Cloudflareを確認する。実際の送信結果はGit履歴とorigin/mainで照合する。
- 実施設の新規調査や実取材はしていない。KIRAKUの将来計画、軽井沢送迎の未解決点は既存の注意を維持。
- Node.js 24.22.1。npmはPATH上にないため同等のローカルNodeコマンドで検証。新規依存なし。
