# 運用

## データ境界

`data/candidates.json` は公式サイト検索から得た全国9地域・10施設の候補。`data/selection.json` と `data/draws/` に候補全体・seed・抽選時刻・アルゴリズム・候補ハッシュを保存。北日本（北海道東北）・東日本（関東中部）・関西・西日本（中国四国）・南日本（九州沖縄）の5区分から1件ずつ抽選します。全国統計の無作為標本ではなく、候補選定には編集上の偏りがある小規模パイロットです。初回v1抽選記録も履歴として保持します。

`data/properties/` は表示データ。初期5件は架空の Imaginary Stay で、実在候補への紐付けは内部 research_id のみ。実施設の客室・食事・温泉などをデモから転用しないでください。

`data/raw/` は検索APIや生成APIのレスポンス、`data/sources/` は探索URLと同一性検証、`data/snapshots/private/` は許可取得したHTML等（Git除外）、`data/logs/` は実行ログ、`src/content/stays/` は記事です。未知項目は unverified_fields に保存します。

## API探索と収集

検索API仕様: [Brave公式ドキュメント](https://api-dashboard.search.brave.com/app/documentation/web-search/get-started)。候補プールの根拠URLは各候補の official_url と data/editorial-policy.json に記録しています。

環境変数はシェルに明示的に設定します。.env.example を参考に .env を作る場合、Node の `--env-file=.env` を利用してください。Astroの.env読み込みとCLIの環境変数は別です。

利用者の有料利用承認後に限り SEARCH_API_KEY（Brave Search）と ALLOW_PAID_SEARCH=1 を設定し `npm run collect`。媒体ごとに候補最大3件、5施設×7媒体=35リクエスト。未設定時は通信せず35行のスキップ・候補状態を記録。失敗もレポートに残ります。再実行はデモと探索レポートを更新するため変更差分を確認してください。

結果URLはすべて unverified。担当者が施設名・所在地（住所）・公式サイトとの対応を確認し、data/sources の identity_checks と各根拠を記録します。URL探索成功と同一施設確認は別です。検索スニペットは事実確定に使いません。

許可取得済みHTMLは `python scripts/extract.py SNAPSHOT_KEY PROPERTY_ID` で宿泊施設JSON-LDの概要・住所・設備・客室数を data/extracted に抽出します。自動抽出は未確認の提案で、公開JSONへ自動反映しません。食事・温泉・アクセス等の記載が機械的に抽出できない項目は人が根拠を読み取ります。

スクリーンショットが必要な場合のみ `pip install -r scripts/requirements.txt` と `python -m playwright install chromium` を実施。permissions.json に screenshot_allowed=true と permission_basis を記録後 `python scripts/screenshot_allowed.py URL`。各サブリソースも完全一致URLの許可リストに必要です。初期権限リストは空で、ブラウザー起動前に停止します。

取得は事前の利用規約・権限確認を必須にします。`data/permissions.json` に exact URL、fetch_allowed=true、permission_basis を登録後、`python scripts/collect_allowed.py URL`。robots拒否・リダイレクト・非HTML・過大レスポンスは停止します。robots許可だけでは利用権限を意味しません。OTA本文の一括取得、ログイン、CAPTCHA回避は実装していません。Playwrightスクリーンショットは許可が未確認のため初期状態では取得しません。必要時も許可されたページのみ内部保存してください。

## 実施設の記事に移行

新しいIDで mode=live の施設JSONを作り、name, region, prefecture, type, tags, intro, updated_at, facts, review_status=draft を入力。introやタグも人が根拠と照合します。facts は各項目に field, value, source_url, source_name, retrieved_at（ISO日時）, confidence（0〜1）, verification_status を持ちます。所在地・アクセス・客室・食事・温泉・設備・特色・海外旅行者向け情報など、確認できた項目のみ追加。温泉や英語対応等を推定しないでください。

明示的な有料利用承認後、OPENAI_API_KEY と ALLOW_PAID_OPENAI=1 を設定し `npm run generate`。生成結果は必ず draft となり、再生成は承認を取り消します。モデル出力には人の事実確認が必要です。

人が記事全体（intro・タグを含む）を確認後 `node scripts/review.mjs ID REVIEWER` で承認と内容ハッシュを記録。`npm run validate`。承認後に本文またはJSONが変わると検証が失敗します。取材記事は `src/content/interviews/README.md` を参照。

公開検証は `data/sources/<research_id または id>.json` の identity_checks（name/address/official_cross_reference）が全てtrueで、各factのsource_urlが verified のentryと一致することも必須とします。確認できなければ承認できません。

PUBLICATION_MODE=production と実URLの SITE_URL でビルドすると、承認済み実データだけ出力。デモは除外されます。生成記事は第三者HTMLを実行せず、リンク・画像は無効化して出典リンクを別枠表示。公開写真は権限確認ワークフロー追加まで利用不可です。

## GitHub

秘密情報が差分にないことを確認し `npm run validate && npm test && npm run build`。`git add .` / `git commit -m "Build OYADO editorial MVP"` でコミットできます。pushと外部アカウント操作は利用者確認後。GitHub Actions でPR時にビルドを再確認します。公開ブランチへのマージにこのチェックを必須にする保護ルールを設定してください。
