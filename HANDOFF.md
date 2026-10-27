# 最新の引き継ぎ

## 記録・Git状態

- 更新日時：2026-10-27T12:45:49.818+09:00（JST）。
- ブランチ：main。記述時点の基点HEAD：b89fab6c5861eef365e265b9a4c42fd7829cf926。今回の引き継ぎ文書を含む将来のコミットIDとは区別する。
- 追跡先：origin/main。2026-10-27T12:44:25+09:00にgit fetch origin成功、ahead 0 / behind 0。開始時点は未追跡・ステージ済みを含めクリーン。
- 今回の変更対象はHANDOFF.mdのみ。AGENTS.mdとDECISIONS.mdは確認済み、新しい恒久ルール・重要決定はないため変更しない。実装・記事・データ・依存・CIも変更しない。
- 直前の公開実装b89fab6はmainへのPush成功済み。今回のHANDOFF.mdのみのCommit・origin/mainへのPushは、自動公開が起動することを説明後、利用者が「OK」と承認。送信準備時点の記録で、成功はGit履歴とリモートで確認する。

## 公開済みの状態

- 施設ガイドは日本語・英語・簡体字中国語・韓国語の4言語56ページ。実施設は星のや軽井沢・京都・竹富島、KIRAKU ONSEN LIVING、大和屋本店の5件を維持。
- 商談用の架空インタビューは4言語×（一覧＋2記事）＝12ページ。本番は合計68ページ。実写の宿が01、女将のサンプルイラストが02。対応記事への言語切替あり。
- 公開一覧：[日本語](https://oyado-journal.pages.dev/ja/samples/interviews/)、[英語](https://oyado-journal.pages.dev/samples/interviews/)、[簡体字中国語](https://oyado-journal.pages.dev/zh-cn/samples/interviews/)、[韓国語](https://oyado-journal.pages.dev/ko/samples/interviews/)。
- 実写の宿はriverside-retreat、女将はtownhouse-stay。宿写真は星のや京都の水の庭と建物（2011年、Hoshino Resorts、CC BY-SA 3.0）。架空の本文と写真の施設は別で、写真の宿への取材・推薦・協賛を意味しないと全言語に表示。出典・作者・年・ライセンス・加工表示を維持。
- 写真風オーナーポートレートの記事と人物画像は削除済み。旧mountain-innのURLはpublic/_redirectsで同じ言語の一覧へ301転送。
- サンプルはnoindex,nofollow・サイトマップ非掲載。通常の実施設ガイドや未取材のOwner Interviewとは分離。本文の宿名・人物・発言は架空と表示する。

## 依頼背景と重要な制約

- 商談で掲載の雰囲気を見せるため、利用者がサンプルを依頼。写真風人物の記事削除、外観を実写写真へ変更、画像のサイズ統一、実写を先に並べること、4言語への反映と本番公開を明示承認した。これらはb89fab6で完了。
- 宿側には生成技術の言葉が受け入れられにくいという利用者の事情から、サンプル画面はサンプルイラスト・架空の空間イメージ等の表記に統一。創作を実写や実取材と誤認させない説明は残す。生成経緯とプロンプトは内部文書に保持する。
- 日本語の施設ガイド承認はdata/japanese-review.json、韓中はdata/international-review.jsonとscripts/international-review.mjsのハッシュ判定。承認ハッシュと写真の権利記録は維持。今後の別変更・別公開への包括承認ではない。
- 詳細：[多言語サンプル](docs/interview-sample-languages.md)、[商談サンプル](docs/interview-samples.md)、[画像来歴](docs/interview-sample-images.md)。D007の初期方針はD008で更新済み。古い公開前の説明より実コードと最新承認を優先する。

## 検証結果

- 公開準備時（2026-10-27、b89fab6相当）：Astro syncとtsc --noEmit成功。node --test scripts/pipeline.test.mjs scripts/international-review.test.mjsは12件成功。本番ビルド、node scripts/check-output.mjs dist production、node scripts/check-photos.mjs distは68ページで成功。今回の文書整理では再実行していない。
- 同公開準備時：ローカルChromeで4言語12ページのリンク・言語切替・画像読み込み、1440/768/390pxの同一画像サイズ・並び順・横はみ出しを確認。削除対象が出力されず、生成技術の旧表示がサンプル画面に残らないことを確認。
- Push後の公開確認：CIとCloudflare成功、12ページのHTTP・言語・noindex・並び順と、4言語の削除記事301転送を確認済み。
- 今回の引き継ぎ準備（2026-10-27 12:44〜12:45 JST、基点b89fab6）：Git同期を確認。GitHubのvalidate・Cloudflare Pagesはcompleted/success。公開4言語の一覧がHTTP 200、実写が先、noindex有効、旧記事が301であることを読み取り専用で再確認。check-live.mjsは追跡ログを更新するため実行していない。
- 今回の文書検査（同日12:46頃）：3文書のローカルリンク21件の存在、整合性、秘密情報パターンと個人の絶対パスの不在、競合マーカーなし、git diff --check成功、実装差分なしを確認。差分を目視確認済み。文書のみなのでビルド・テストは再実行していない。

## 残タスク・次の具体的な手順

1. P1：承認済みのHANDOFF.mdをCommitし、origin/mainへPushする。文書だけでもCloudflareの自動公開を起動することは説明済み。Push直前に再fetchし、リモート進行があれば止める。別端末では実際の送信結果をGit履歴とリモートで確認する。
2. 別端末ではmainを同期し、リポジトリルートから新しいチャットで「再開」。基点との差分と承認を照合し、次の利用者指示を待つ。新規改善タスクは未指定。
3. 新規の実取材・新たな写真収集・母語話者による独立校閲は、次の改善作業としては未依頼。現在のサンプルは実取材・独立校閲を経たものではない。サンプルを実績や実在宿の発言として扱わない。
4. 既存調査の注意（KIRAKUの2027年計画、軽井沢の送迎案内の不一致）は未解決。予約前の確認事項として維持する。

## ローカル環境・非同期のもの

- Node.js 24.22.1。npmがPATH上にないため同等のNodeスクリプトとローカルCLIで検証。新規依存なし。別端末はNode.js 24とnpmを用意し、必要ならnpm ciで導入する。
- 撮影と検証補助スクリプトはdata/snapshots/private/interview-samples/（Git除外）。元の生成PNG・内部スクリーンショット・node_modulesはGitで同期されない。WebPと権利情報はGit管理済み。
- 作業時は本番プレビューをlocalhost:4325で使用。今回の終了確認ではサーバーの稼働を保証しない。通常の確認はnpm run dev:reviewでlocalhost:4322へ。ブラウザの開いたタブだけでサーバー稼働と判断しない。
- ローカルのcodex/interview-sample-languagesはmainへfast-forward済みでリモートへ単独Pushしていない。次端末の再開先はmain。
